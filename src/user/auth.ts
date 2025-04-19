import { sendAuthVerifyMail } from '@/transporter';
import { TLogin } from '@/utils/types';
import * as bcrypt from 'bcrypt';
import {
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getRandomCode,
} from '@/utils/service';
import { RequestHandler } from 'express';
import { getPasswordByEmail } from '@/db/passwords/passwords';
import { createCode, deleteCode, findCode } from '@/db/codes/codes';
import { resAuthUser } from './utils';
import { getIDByEmail } from '@/db/emails/emails';

export const authUser: RequestHandler = async (req, res) => {
  const user: TLogin = req.body;
  const check = checkFields(user, ['email', 'password']);

  if (check) {
    return CustomError(res, 400, check);
  }

  const encrypted = await getPasswordByEmail(user.email);

  if (!encrypted) {
    return CustomError(res, 401, 'Аккаунта с такой почтой не существует.');
  }

  if (!(await bcrypt.compare(user.password, encrypted))) {
    return CustomError(res, 401, 'Почта или пароль неверны.');
  }

  try {
    const code = getRandomCode();
    const id = await getIDByEmail(user.email);

    if (!id) {
      return CustomError(
        res,
        500,
        `Пользователя с почтой ${user.email} не существует.`,
        new Error(
          `Расхождения в базах данных: ${user} не был найден в базе данных EMAILS`,
        ),
      );
    }

    const info = await sendAuthVerifyMail([user.email], code);

    if (!info) {
      return CustomError(
        res,
        500,
        `Письмо не удалось отправить на почту ${user.email}. Пожалуйста, попробуйте позже.`,
      );
    }

    await createCode(id, code, req.body);
    res.status(200).send({ status: true, data: 'Код отправлен на почту.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const authCodeVerify: RequestHandler = async (req, res) => {
  const { code } = req.body;

  try {
    const codeData = await findCode(code);

    if (!codeData) {
      return CustomError(res, 401, 'Код не найден.');
    }

    if (codeData.createdAt + 5 * 60 * 1000 < Date.now()) {
      await deleteCode(code);
      return CustomError(res, 401, 'Код не действителен.');
    }

    await deleteCode(code);
    return await resAuthUser(res, codeData._id);
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
