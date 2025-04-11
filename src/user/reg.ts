import {
  checkEmailForSame,
  getEmails,
  getNextUserID,
  writeEmails,
  writePassword,
  writeUser,
} from '@/db/db';
import { sendVerifyMail } from '@/transporter';
import { TRegister } from '@/utils/types';
import {
  checkFields,
  createNewUser,
  CustomError,
  ERROR_MESSAGE,
} from '@/utils/utils';
import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';

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

export const regSendMail: RequestHandler = async (req, res, next) => {
  const { email }: TRegister = req.body;
  const key = randomUUID();
  try {
    const emails = await getEmails();
    await writeEmails([
      ...emails,
      { verify: false, email: email, key: { key: key, createdAt: Date.now() } },
    ]);
    const info = await sendVerifyMail([email], key);
    if (info) {
      next();
    } else {
      throw new Error('Письмо вернуло void!');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const regUser: RequestHandler = async (req, res) => {
  const { username, email, password }: TRegister = req.body;
  try {
    const id = await getNextUserID();
    const newUser = createNewUser(id, username, email);

    await writeUser(newUser);
    await writePassword(email, password);

    res.status(200).send({ status: true, data: newUser });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
