import { TAccessTokenBody } from '@/db/sessions/types';
import { UUID } from 'crypto';
import { NextFunction, RequestHandler, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { CustomError, ERROR_MESSAGE } from './service';
import { getSessionByID } from '@/db/sessions/sessions';
import { getEmailByID } from '@/db/emails/emails';
import { sendAlertMail } from '@/transporter';

export const createToken = <T extends object>(
  payload: T,
  key: UUID,
  expriresIn: number | StringValue | undefined,
): string => {
  return jwt.sign(payload, key, { expiresIn: expriresIn } as SignOptions);
};

export const verifyToken = <T>(token: string, key: UUID): T => {
  return jwt.verify(token, key) as T;
};

export const getTokenPayload = <T>(token: string): T => {
  return jwt.decode(token) as T;
};

export const verifyTokenWithResponse = async (
  res: Response,
  token: string,
  next?: NextFunction,
): Promise<void> => {
  try {
    const { id, sessionID } = getTokenPayload<TAccessTokenBody>(token);

    if (!id || !sessionID) {
      return CustomError(res, 400, 'Токен не содержит необходимой информации.');
    }

    const session = await getSessionByID(sessionID);

    if (!session) {
      return CustomError(res, 401, 'Токен не дейстивтелен.');
    }

    jwt.verify(token, session.key);

    if (next) {
      next();
    }
  } catch (error) {
    const err = error as Error;

    if (err.message === 'jwt expired') {
      return CustomError(res, 400, 'Токен не дейстивтелен.');
    }

    if (err.message === 'invalid signature') {
      return CustomError(res, 400, 'Ошибка авторизации.', err);
    }

    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const checkAccessTokenHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return CustomError(res, 400, 'Вы не авторизованы.');
  }

  await verifyTokenWithResponse(res, auth, next);
};
