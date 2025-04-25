import { TAccessTokenBody } from '@/db/sessions/types';
import { UUID } from 'crypto';
import { NextFunction, RequestHandler, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { CustomError, ERROR_MESSAGE } from './service';
import { getSession } from '@/db/sessions/sessions';
import { getEmailByID } from '@/db/emails/emails';
import { sendAlertMail } from '@/transporter';
import { getCookie } from './cookie';

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
  const { id, sessionID } = getTokenPayload<TAccessTokenBody>(token);

  if (!id || !sessionID) {
    return CustomError(res, 400, 'Токен не содержит необходимой информации.');
  }

  try {
    const session = await getSession(sessionID);

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
      return CustomError(res, 401, 'Токен не дейстивтелен.');
    }

    if (err.message === 'invalid signature') {
      const email = await getEmailByID(id);
      if (email) {
        await sendAlertMail([email.email]);
      }
      return CustomError(res, 401, 'Ошибка авторизации.', err);
    }

    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
};

export const checkAccessTokenHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return CustomError(res, 400, 'Вы не авторизованы.');
  }

  const acceessToken = getCookie('accessToken', cookie);

  if (!acceessToken) {
    return CustomError(res, 400, 'Вы не авторизованы.');
  }

  await verifyTokenWithResponse(res, acceessToken, next);
};
