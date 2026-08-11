import { Request, Response, NextFunction } from 'express';
import {
  createAuthToken,
  createRefreshToken,
  verifyToken,
} from '@/utils/tokens/index.js';
import { CustomError } from '@/utils/response/index.js';
import {
  TAuthTokenPayload,
  TRefreshTokenPayload,
} from '@/models/users/types.js';
import {
  GetSessionByID,
  UpdateSessionByID,
} from '@/services/users/sessions.service.js';
import ms from 'ms';

export async function authCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth_token = req.cookies.auth_token;

  if (auth_token) {
    const user_id = verifyToken<TAuthTokenPayload>(auth_token, 'auth')?.user_id;

    // Пропускаем пользователя
    if (user_id) {
      res.locals.userID = user_id;
      return next();
    }
  }

  const refresh_token = req.cookies.refresh_token;

  if (refresh_token) {
    const session_id = verifyToken<TRefreshTokenPayload>(
      refresh_token,
      'refresh',
    )?.session_id;

    // Обновляем токен
    if (session_id) {
      try {
        // Получаем сессии, которые нам подходят
        const session = await GetSessionByID(session_id);

        if (session) {
          // Генерируем новые токены
          const newAuthToken = createAuthToken(session.user_id);
          const newRefreshToken = createRefreshToken(session.id);

          // Обновляем данные в сессии
          await UpdateSessionByID(session.id);

          // Устанавливаем новые куки
          res.cookie('auth_token', newAuthToken, {
            sameSite: 'strict',
            secure: true,
            httpOnly: true,
            maxAge: ms('15min'),
          });
          res.cookie('refresh_token', newRefreshToken, {
            sameSite: 'strict',
            secure: true,
            httpOnly: true,
            maxAge: ms('7days'),
          });

          res.locals.userID = session.user_id;
          return next();
        } else {
          res.clearCookie('refresh_token');
        }
      } catch (error) {
        return CustomError(res, { code: 500, logger: error });
      }
    }
  }

  return CustomError(res, { code: 401 });
}
