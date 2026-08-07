import { Request, Response, NextFunction } from 'express';
import {
  createAuthToken,
  createRefreshToken,
  verifyToken,
} from '@/utils/tokens';
import { CustomError } from '@/utils/response';
import { TAuthTokenPayload, TRefreshTokenPayload } from '@/models/users/types';
import {
  GetSessionByID,
  UpdateSessionByID,
} from '@/services/users/sessions.service';

export async function authCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { auth_token, refresh_token } = req.cookies;

  if (auth_token) {
    const user_id = verifyToken<TAuthTokenPayload>(auth_token)?.user_id;

    // Пропускаем пользователя
    if (user_id) {
      req.userId = user_id;
      return next();
    }
  }

  if (refresh_token) {
    const session_id =
      verifyToken<TRefreshTokenPayload>(refresh_token)?.session_id;

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
          res.cookie('auth_token', newAuthToken, { sameSite: true });
          res.cookie('refresh_token', newRefreshToken, { sameSite: true });

          req.userId = session.user_id;
          return next();
        }
      } catch (error) {
        return CustomError(res, { code: 500, logger: error });
      }
    }
  }

  return CustomError(res, { code: 401 });
}
