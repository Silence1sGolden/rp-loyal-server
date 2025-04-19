import { sendAuthVerifyMail } from '@/transporter';
import { TRegister } from '@/utils/types';
import {
  checkFields,
  createNewProfile,
  CustomError,
  ERROR_MESSAGE,
  getRandomCode,
} from '@/utils/service';
import { RequestHandler } from 'express';
import { createUser } from '@/db/users/users';
import { createPassword, getPasswordByEmail } from '@/db/passwords/passwords';
import { createCode, deleteCode, findCode } from '@/db/codes/codes';
import { resAuthUser } from './utils';
import { randomUUID } from 'crypto';
import { createEmail } from '@/db/emails/emails';

export const regUser: RequestHandler = async (req, res) => {
  const user: TRegister = req.body;
  const checkBody = checkFields(user, ['email', 'password', 'username']);

  if (checkBody) {
    return CustomError(res, 400, checkBody);
  }

  try {
    if (await getPasswordByEmail(user.email)) {
      return CustomError(
        res,
        401,
        'Пользователь с такой почтой уже существует.',
      );
    }

    const id = randomUUID();
    const code = getRandomCode();

    await createCode(id, code, {
      email: user.email,
      password: user.password,
      username: user.username,
    });

    const info = await sendAuthVerifyMail([user.email], code);

    if (!info) {
      return CustomError(
        res,
        500,
        `Письмо не удалось отправить на почту ${user.email}. Пожалуйста, попробуйте позже.`,
      );
    }
    res.status(200).send({ status: true, data: 'Код отправлен на почту.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const regCodeVerify: RequestHandler = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await findCode(code);

    if (!user) {
      return CustomError(res, 401, 'Код не действителен.', '!user');
    }

    if (user.createdAt + 5 * 60 * 1000 < Date.now()) {
      return CustomError(res, 401, 'Код не действителен.', 'createdAt');
    }

    const { _id, username, email, password } = user;
    const profile = createNewProfile(_id, username!);

    await createPassword(email!, password!);
    await createUser(profile);
    await createEmail(user.email!, user._id);
    await deleteCode(code);
    await resAuthUser(res, _id);
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
