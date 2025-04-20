import {
  createToken,
  CustomError,
  ERROR_MESSAGE,
  getTokenPayload,
  verifyToken,
} from '@/utils/service';
import { RequestHandler, Response } from 'express';
import { getUserByID } from '@/db/users/users';
import {
  createSession,
  deleteSession,
  getSession,
  updateSession,
} from '@/db/sessions/sessions';
import { randomUUID, UUID } from 'crypto';
import { getEmailByID } from '@/db/emails/emails';
import { sendAlertMail } from '@/transporter';

export const getProfile: RequestHandler = async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    return CustomError(res, 400, 'ID пользователя не определён.');
  }

  try {
    const user = await getUserByID(id);

    if (!user) {
      return CustomError(res, 404, 'Пользователь с таким id не найден.');
    }

    res.status(200).send({ status: true, data: user });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const resAuthUser = async (res: Response, id: UUID) => {
  const user = await getUserByID(id);
  const key = randomUUID();
  const sessionID = randomUUID();

  const accessToken = createToken(
    { id: id, sessionID: sessionID },
    key,
    5 * 60 * 1000,
  );
  const refreshToken = createToken(
    { sessionID: sessionID },
    key,
    24 * 60 * 60 * 1000,
  );
  await createSession({
    id: id,
    sessionID: sessionID,
    key: key,
    deathTime: Date.now() + 24 * 60 * 60 * 1000,
  });

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

export const refreshSession: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return CustomError(res, 400, 'Отсутствует refreshToken');
  }

  const { sessionID } = getTokenPayload<{ sessionID: UUID }>(refreshToken);

  try {
    const session = await getSession(sessionID);

    if (!session) {
      return CustomError(res, 403, 'Сессия недоступна.');
    }

    verifyToken(refreshToken, session.key);

    await deleteSession(sessionID);
    resAuthUser(res, session.id);
  } catch (error) {
    const err = error as Error;

    if (err.message === 'jwt expired') {
      const session = await getSession(sessionID);
      const email = await getEmailByID(session!.id);

      if (!email) {
        return CustomError(
          res,
          400,
          'Токен не найден.',
          `Попытка потенциального взлома ${session?.id}`,
        );
      }

      sendAlertMail([email.email]);
      deleteSession(sessionID);
      return CustomError(res, 400, 'Токен не дейстивтелен.');
    }

    if (err.message === 'invalid signature') {
      // TODO
      // сделать отправку сообщения на почту о том,
      // что в аккаунт пытаются войти
      // или оповещение об подозрительной активности
      return CustomError(res, 500, ERROR_MESSAGE, err);
    }

    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
