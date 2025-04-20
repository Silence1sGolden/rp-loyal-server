import {
  createToken,
  CustomError,
  ERROR_MESSAGE,
  getTokenPayload,
} from '@/utils/service';
import { RequestHandler, Response } from 'express';
import { getUserByID } from '@/db/users/users';
import {
  createSession,
  deleteSession,
  getSession,
} from '@/db/sessions/sessions';
import { randomUUID, UUID } from 'crypto';

export const getProfileHandler: RequestHandler = async (req, res) => {
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
      maxAge: 5 * 60 * 1000,
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

export const refreshSessionHandler: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;
  const { sessionID } = getTokenPayload<{ sessionID: UUID }>(refreshToken);

  try {
    const session = await getSession(sessionID);
    await deleteSession(sessionID);
    resAuthUser(res, session!.id);
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
};
