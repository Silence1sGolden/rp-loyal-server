import { RequestHandler } from 'express';
import { verifyToken } from '@/utils/tokens/index.js';
import { CustomError } from '@/utils/response/index.js';
import { GetUserByID } from '@/modules/auth/users.service.js';
import { db } from '@/db.js';
import { refresh } from './auth.helper.js';
import { AuthTokenPayload } from '@/models/schemas/users.js';

export const authenticate: RequestHandler = async (req, res, next) => {
  const auth_token = req.cookies.auth_token;

  if (auth_token) {
    const user_id = verifyToken<AuthTokenPayload>(auth_token, 'auth')?.user_id;

    if (user_id) {
      try {
        const user = await GetUserByID(db, user_id);

        if (user) {
          res.locals.userID = user_id;
          return next();
        }
        throw new Error('Unknown user');
      } catch (error) {
        res.clearCookie('auth_token');
        res.clearCookie('refresh_token');
        return CustomError(res, { code: 404, logger: error });
      }
    }
  }

  try {
    await refresh(req, res);

    next();
  } catch (error) {
    res.clearCookie('auth_token');
    res.clearCookie('refresh_token');

    return CustomError(res, { code: 401, logger: error });
  }
};
