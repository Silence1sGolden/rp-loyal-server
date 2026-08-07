import { TCodeBody } from '@/models/mail/types';
import { CheckCode } from '@/services/users/codes.service';
import { GetUserByEmail } from '@/services/users/users.service';
import { CustomError } from '@/utils/response';
import { checkFields } from '@/utils/service';
import { RequestHandler } from 'express';

export const codeValidate: RequestHandler = async (req, res, next) => {
  const body: TCodeBody = req.body;

  if (checkFields(body, ['code', 'email'])) {
    return CustomError(res, { code: 400 });
  }

  const { email, code } = body;

  try {
    const user = await GetUserByEmail(email);

    if (!user) {
      return CustomError(res, { code: 400 });
    }

    const check = await CheckCode(user.id, code);

    if (!check) {
      return CustomError(res, { code: 400 });
    }

    req.userId = user.id;
    next();
  } catch (error) {}
};
