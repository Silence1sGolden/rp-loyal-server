import { checkEmailForSame, getPasswords, writeCode } from '@/db/db';
import { sendAuthVerifyMail } from '@/transporter';
import { TLogin } from '@/utils/types';
import * as bcrypt from 'bcrypt';
import {
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getRandomCode,
} from '@/utils/utils';
import { RequestHandler } from 'express';

export const authCheckFields: RequestHandler = (req, res, next) => {
  const user: TLogin = req.body;
  const check = checkFields(user, ['email', 'password']);
  if (check) {
    CustomError(res, 404, check);
  } else {
    next();
  }
};

export const authEmailCheck: RequestHandler = async (req, res, next) => {
  const { email }: TLogin = req.body;

  try {
    const result = await checkEmailForSame(email);
    if (result) {
      next();
    } else {
      CustomError(res, 404, 'Аккаунта с такой почтой не существует.');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
    if (typeof err == 'string') {
      throw new Error(err);
    }
  }
};

export const authPasswordCheck: RequestHandler = async (req, res, next) => {
  const { email, password }: TLogin = req.body;

  try {
    const passwords = await getPasswords();
    const encrypted = passwords[email];
    if (encrypted) {
      const result = await bcrypt.compare(password, encrypted);

      if (result) {
        next();
      } else {
        CustomError(res, 404, 'Почта или пароль неверны.');
      }
    } else {
      throw new Error('Аккаунт создан без записи в базе паролей!');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const authSendMail: RequestHandler = async (req, res) => {
  const { email }: TLogin = req.body;
  const code = getRandomCode();

  try {
    const info = await sendAuthVerifyMail([email], code);
    if (!info) {
      throw new Error('Письмо вернуло void!');
    }
    await writeCode(email, code);
    res.status(200).send({ status: true, data: 'Код отправлен на почту.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
