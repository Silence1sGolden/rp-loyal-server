import { sendRegMailWithToken } from '@/transporter';
import { TRegister } from '@/utils/types';
import {
  checkFields,
  createNewProfile,
  createNewUser,
  createToken,
  CustomError,
  ERROR_MESSAGE,
  verifyToken,
} from '@/utils/service';
import { RequestHandler } from 'express';
import {
  checkEmailForSame,
  createEmail,
  deleteEmail,
  verifyEmail,
} from '@/db/emails/emails';
import { deleteUser, getNextUserID } from '@/db/users/users';
import { createPassword, deletePassword } from '@/db/passwords/passwords';

// Перый этап регистрации
export const regCheckFields: RequestHandler = async (req, res, next) => {
  const user: TRegister = req.body;
  const checkBody = checkFields(user, ['email', 'password', 'username']);

  if (checkBody) {
    CustomError(res, 400, checkBody);
  } else {
    next();
  }
};
export const regCheckForSameEmail: RequestHandler = async (req, res, next) => {
  const { email }: TRegister = req.body;

  try {
    const result = await checkEmailForSame(email);

    if (result) {
      CustomError(res, 404, 'Пользователь с такой почтой уже существует.');
    } else {
      next();
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
export const regCreateTokenAndSendMail: RequestHandler = async (req, res) => {
  try {
    const { email, password, username }: TRegister = req.body;
    const id = await getNextUserID();
    const token = createToken({ id: id, username: username }, 5 * 60);
    await createEmail(id, email);
    await createPassword(email, password);
    await createNewUser(id, email, username);
    const info = await sendRegMailWithToken([email], token);

    if (info) {
      res
        .status(200)
        .send({ status: true, data: 'Пожалуйста, подтвердите почту.' });
    } else {
      deleteEmail(id);
      deletePassword(id);
      deleteUser(id);
      CustomError(
        res,
        500,
        `Письмо не удалось отправить на почту ${email}. Пожалуйста, попробуйте позже.`,
      );
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

// Второй этап регистрации
export const regCheckToken: RequestHandler = async (req, res) => {
  const token = req.params.key;

  try {
    const { id, username } = await verifyToken<{
      id: string;
      username: string;
    }>(token);
    await verifyEmail(id);
    await createNewProfile(id, username);

    res.redirect('/login');
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
