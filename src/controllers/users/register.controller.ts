import { TAuthTokenPayload } from '@/models/users/types.js';
import { VarifyUser } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { verifyToken } from '@/utils/tokens/index.js';
import { RequestHandler } from 'express';

export const registerController: RequestHandler = async (req, res) => {
  const jwtlink: string | undefined = res.locals.jwtlink;

  if (!jwtlink) {
    return CustomError(res, { code: 404 });
  }

  try {
    const check = verifyToken<TAuthTokenPayload>(jwtlink, 'verify');

    if (!check) {
      return CustomError(res, { code: 400 });
    }

    const { user_id } = check;

    const result = await VarifyUser(user_id);

    if (!result) {
      return CustomError(res, { code: 400 });
    }

    CustomResponse(res, { code: 200, message: 'Success' });
  } catch (error) {
    return CustomError(res, { code: 500, logger: error });
  }
};
