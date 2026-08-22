import { TCodeBody } from '@/models/mail/types.js';
import { attachAuthTokens } from '@/services/users/auth.service.js';
import { CheckCode } from '@/services/users/codes.service.js';
import { GetUserByEmail } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const authController: RequestHandler = async (req, res) => {
  const data: TCodeBody | undefined = res.locals.code;

  if (!data) {
    throw new Error('Code body is missing.');
  }

  const { email, code } = data;

  try {
    const user = await GetUserByEmail(email);

    if (!user) {
      return CustomError(res, { code: 400 });
    }

    const check = await CheckCode(user.user_id, code);

    if (!check) {
      return CustomError(res, { code: 400 });
    }

    await attachAuthTokens(res, user.user_id);
    CustomResponse(res);
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
