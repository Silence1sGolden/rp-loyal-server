import { createToken, CustomError, ERROR_MESSAGE } from '@/utils/service';
import { RequestHandler, Response } from 'express';
import { getUserByID } from '@/db/users/users';
import { createSession } from '@/db/sessions/sessions';
import { UUID } from 'crypto';

export const getUserCheck: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    CustomError(res, 400, 'ID пользователя не определён.');
  } else {
    next();
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  const id = req.params.id as UUID;

  try {
    const user = await getUserByID(id);

    if (user) {
      res.status(200).send({ status: true, data: user });
    } else {
      CustomError(res, 404, 'Пользователь с таким id не найден.');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const resAuthUser = async (res: Response, id: UUID) => {
  const user = await getUserByID(id);
  const accessToken = createToken({ id }, 5 * 60);
  const refreshToken = createToken({ id }, 60 * 60 * 24 * 2);
  await createSession(id, accessToken, refreshToken);

  res
    .cookie('accessToken', accessToken, {
      maxAge: Date.now() + 5 * 60 * 1000,
    })
    .status(200)
    .send({
      status: true,
      data: {
        refreshToken: refreshToken,
        user: user,
      },
    });
};
