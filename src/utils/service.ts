import { NextFunction, RequestHandler, Response } from 'express';
import * as dotenv from 'dotenv';
import { deleteCode, getCodes } from '@/db/codes/codes';
import jwt, { Secret } from 'jsonwebtoken';
import { TProfile } from '@/db/users/types';
import { UUID } from 'crypto';
import { getSession } from '@/db/sessions/sessions';
import { getEmailByID } from '@/db/emails/emails';
import { sendAlertMail } from '@/transporter';

dotenv.config();
export const BASE_URL = process.env.BASE_URL || 'http://192.168.1.100:443';
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const ERROR_MESSAGE = 'У нас что-то сломалось, попробуйте позже ;(';
export const SECRET: Secret = process.env.SECRET || 'secret';

export function getRandomCode(): number {
  return Math.round(Math.random() * (999999 - 100000) + 100000);
}

export function CustomError(
  res: Response,
  resErrorCode?: number,
  resErrorText?: string,
  devError?: Error | string | unknown,
) {
  if (resErrorCode && resErrorText) {
    res.status(resErrorCode).send({ error: resErrorText });
  } else {
    res.status(505).send({ error: resErrorText });
  }
  devError && console.error(`${resErrorCode}: ${devError}`);
}

export function checkFields<T>(obj: T, fields: (keyof T)[]): string | null {
  if (!obj) {
    return 'Данные отсутсвуют.';
  }
  if (typeof obj !== 'object') {
    return 'Данные не являются обьектом.';
  }
  fields.forEach((key) => {
    if (!(key in obj) || !obj[key]) {
      return `Поле ${String(key)} нет в обьекте или оно пустое.`;
    }
  });
  return null;
}

export function createNewProfile(id: UUID, useranme: string): TProfile {
  return {
    _id: id,
    username: useranme,
    profileIMG: '',
    about: '',
    stats: {
      likes: [],
      fans: [],
      rewards: [],
    },
    status: '',
    likesTags: [],
    forms: [],
  };
}

export const clearCodes = async () => {
  console.log('Проверка итсёкших по времени кодов:...');
  try {
    const codes = await getCodes();
    const keys = Object.keys(codes);

    keys.forEach(async (code) => {
      if (Date.now() - codes[+code].createdAt > 5 * 60 * 1000) {
        console.log(code + ' был удалён.');
        await deleteCode(+code);
      }
    });
  } catch (err) {
    console.log(err);
  }
  console.log('Проверка завершена.');
};

export const createToken = <T extends object>(
  payload: T,
  key: UUID,
  expriresIn: number,
): string => {
  return jwt.sign(payload, key, { expiresIn: expriresIn });
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
  const { id, sessionID } = getTokenPayload<{ id: UUID; sessionID: UUID }>(
    token,
  );

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
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  await verifyTokenWithResponse(res, accessToken, next);
};

export const checkRefreshTokenHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  const refreshToken: UUID = req.body.refreshToken;

  if (!refreshToken) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  await verifyTokenWithResponse(res, refreshToken, next);
};
