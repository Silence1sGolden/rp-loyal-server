import { RequestHandler } from 'express';
import { checkFields } from '@/utils/service.js';
import bcrypt from 'bcrypt';
import { GetUserByEmail } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { sendCodeMail } from '@/services/mail/mail.service.js';
import { TLoginBody } from '@/models/users/types.js';
import { CreateCode } from '@/services/users/codes.service.js';
import { attachAuthTokens } from './auth.service.js';

export const authValidate: RequestHandler = async (req, res) => {
  const body: TLoginBody = req.body;

  if (checkFields(body, ['email', 'password'])) {
    return CustomError(res, { code: 400 });
  }

  const { email, password } = body;

  try {
    const user = await GetUserByEmail(email);

    if (!user) {
      return CustomError(res, { code: 400, error: 'User not found.' });
    }

    if (
      user.email === 'admin@gmail.com' &&
      (await bcrypt.compare(password, user.pass_hash))
    ) {
      await attachAuthTokens(res, user.user_id);

      return CustomResponse(res, { data: { message: 'Hello, admin!' } });
    }

    if (user.is_activated === 0) {
      return CustomError(res, { code: 403, error: 'Confirm email required.' });
    }

    const match = await bcrypt.compare(password, user.pass_hash);

    if (!match) {
      return CustomError(res, { code: 400 });
    }

    const code = await CreateCode(user.user_id);

    if (!code) {
      throw new Error(`Failed to create code.`);
    }

    const mailStatus = await sendCodeMail([user.email], code);

    if (!mailStatus) {
      throw new Error(`Failed to send email: ${email}`);
    }

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
