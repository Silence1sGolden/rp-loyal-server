import { RequestHandler } from 'express';
import { checkFields } from '@/utils/service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { CreateUser, GetUserByEmail } from '@/services/users/users.service.js';
import { CreatePassword } from '@/services/users/passwords.service.js';
import { TRegBody } from '@/models/users/types.js';
import { createAuthToken, createVerifyToken } from '@/utils/tokens/index.js';
import { sendLinkMail } from '../mail/mail.service.js';

export const regValidate: RequestHandler = async (req, res) => {
  const body: TRegBody = req.body;

  if (checkFields(body, ['email', 'password', 'username'])) {
    return CustomError(res, { code: 400 });
  }

  const { email, password, username } = body;

  try {
    const hasUser = await GetUserByEmail(email);

    if (hasUser) {
      return CustomError(res, {
        code: 400,
        error: 'A user with this email already exists',
      });
    }

    const user_id = await CreateUser(username, email);

    if (!user_id) {
      throw new Error('The user has not been created.');
    }

    const passIsCreated = await CreatePassword(user_id, password);

    if (!passIsCreated) {
      throw new Error('The password was not created for the user.');
    }

    const jwtlink = createVerifyToken(user_id);

    const result = await sendLinkMail(email, jwtlink);

    if (!result) {
      return CustomError(res, { code: 500 });
    }

    CustomResponse(res, {
      code: 200,
      data: { message: 'Confirmation has been sent to your email.' },
    });
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
