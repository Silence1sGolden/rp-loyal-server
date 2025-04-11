import { getUsers } from '@/db/db';
import { CustomError, ERROR_MESSAGE } from '@/utils/utils';
import { RequestHandler } from 'express';

export const getUserCheck: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    CustomError(res, 400, 'ID пользователя не определён.');
  } else {
    next();
  }
};

export const getUser: RequestHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const users = await getUsers();
    const user = users.find((item) => item._id == id);

    if (!user) {
      CustomError(res, 404, 'Пользователь с таким id не найден.');
    } else {
      user.email = '***';
      res.status(200).send({ status: true, data: { user } });
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
