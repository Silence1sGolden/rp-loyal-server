import { TAuthTokenPayload } from '@/models/auth.js';
import { createProfile } from '@/services/profiles.service.js';
import { GetUserByID, VerifyUser } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { verifyToken } from '@/utils/tokens/index.js';
import { RequestHandler } from 'express';

export const registerController: RequestHandler = async (_, res) => {
  const jwtlink: string | undefined = res.locals.jwtlink;

  if (!jwtlink) {
    return CustomError(res, { code: 400 });
  }

  try {
    const check = verifyToken<TAuthTokenPayload>(jwtlink, 'verify');

    if (!check) {
      return CustomError(res, { code: 400, error: 'Incorrect token.' });
    }

    const { user_id } = check;

    const user = await GetUserByID(user_id);

    if (!user) {
      return CustomError(res, { code: 404 });
    }

    if (user && user.is_activated) {
      return CustomError(res, { code: 400, error: 'User already activated.' });
    }

    const result = await VerifyUser(user_id);

    if (!result) {
      return CustomError(res, { code: 400, error: "Can't verify user." });
    }

    const profileIsCreated = await createProfile(user_id, user.username);

    if (!profileIsCreated) {
      return CustomError(res, { code: 400, error: "Can't create profile" });
    }

    CustomResponse(res, { code: 200 });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};
