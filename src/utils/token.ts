import { TAccessTokenBody } from '@/db/sessions/types';
import { UUID } from 'crypto';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { checkFields, CustomError } from './service';
import { getSessionByID } from '@/db/sessions';

export const createToken = (
  payload: object,
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

export const verifyTokenHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next?: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      CustomError(res, 401);
      return;
    }

    const payload = getTokenPayload<TAccessTokenBody>(token);
    const check = checkFields(payload, ['id', 'sessionID']);

    if (check) {
      CustomError(res, 401);
      return;
    }

    const session = await getSessionByID(payload.sessionID);

    if (!session) {
      CustomError(res, 401);
      return;
    }

    jwt.verify(token, session.key);

    if (next) {
      next();
    }
  } catch (error) {
    const err = error as Error;

    if (err.message === 'invalid signature') {
      console.log('INVALID_SIGNATURE', req);
    }

    CustomError(res, 500);
  }
};
