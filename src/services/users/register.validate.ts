import { RequestHandler } from 'express';
import { checkFields } from '@/utils/service';
import { CustomError } from '@/utils/response';
import { CreateUser, GetUserByEmail } from '@/services/users/users.service';
import { CreatePassword } from '@/services/users/passwords.service';
import { TRegBody } from '@/models/users/types';

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
        message: 'A user with this email already exists',
      });
    }

    const userID = await CreateUser(username, email);

    if (!userID) {
      throw new Error('The user has not been created.');
    }

    const createdPass = await CreatePassword(userID, password);

    if (createdPass !== userID) {
      throw new Error('The password was not created for the user.');
    }
  } catch (error) {
    CustomError(res, { code: 500, logger: error });
  }
};
