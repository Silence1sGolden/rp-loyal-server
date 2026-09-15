import { RequestHandler } from 'express';
import { checkFields } from '@/utils/service.js';
import bcrypt from 'bcrypt';
import { GetUserByEmail } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { sendCodeMail } from '@/services/mail/mail.service.js';
import { CreateCode } from '@/services/users/codes.service.js';
import { TLoginBody } from '@/models/auth.js';

export const authValidate: RequestHandler = async (req, res) => {
  const body: TLoginBody = req.body;
  const check = checkFields(body, ['email', 'password']);

  if (check) {
    return CustomError(res, { code: 400, error: check });
  }

  const { email, password } = body;

  try {
    const user = await GetUserByEmail(email);

    if (!user) {
      return CustomError(res, {
        code: 400,
        error: 'Incorrect email or password.',
      });
    }

    if (user.is_activated === 0) {
      return CustomError(res, { code: 403, error: 'Confirm email required.' });
    }

    const match = await bcrypt.compare(password, user.pass_hash);

    if (!match) {
      return CustomError(res, {
        code: 400,
        error: 'Incorrect email or password.',
      });
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
