import { USERS } from '@/data/users';
import { sendVerifyMail } from '@/transporter';
import { TRegister } from '@/utils/types';
import { checkFields, CustomError } from '@/utils/utils';
import { RequestHandler } from 'express';

export const findCheck: RequestHandler = (req, res, next) => {
  const checkResponse = checkFields<{ id: string }>(req.body, ['id']);
  if (checkResponse) {
    CustomError(res, 400, checkResponse);
  } else {
    next();
  }
};

export const find: RequestHandler = (req, res) => {
  const ID = req.body.id;

  const user = USERS.find((item) => item._id === ID);

  if (!user) {
    CustomError(res, 404, 'Пользователь с таким id не найден.');
  } else {
    res.status(200).send({ status: true, data: { user } });
  }
};

export const addCheck: RequestHandler = (req, res, next) => {
  const checkResponse = checkFields<TRegister>(req.body, [
    'email',
    'password',
    'username',
  ]);
  if (checkResponse) {
    CustomError(res, 400, checkResponse);
  } else {
    next();
  }
};

export const add: RequestHandler = async (req, res) => {
  const register: TRegister = req.body;

  const info = await sendVerifyMail([register.email]);

  if (!info) {
    res.status(500).send({
      error: 'Произошла непредвиденная ошибка, повторите попытку позже.',
    });
  } else {
    res
      .status(200)
      .send({ status: true, data: `Код отправлен на почту ${register.email}` });
  }
};
