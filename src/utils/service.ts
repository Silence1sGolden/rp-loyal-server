import { Response } from 'express';
import * as dotenv from 'dotenv';
import { deleteCode, getCodes } from '@/db/codes/codes';
import { Secret } from 'jsonwebtoken';
import { TProfile } from '@/db/profiles/types';
import { randomUUID, UUID } from 'crypto';
import { createSession } from '@/db/sessions/sessions';
import ms from 'ms';
import { getProfileByID } from '@/db/profiles/profiles';
import { createToken } from './token';

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

export const getKeysOfObject = <T extends object, A extends keyof T>(
  data: T,
): A[] => {
  return Object.keys(data) as A[];
};

export const authUserWithResponse = async (res: Response, id: UUID) => {
  const user = await getProfileByID(id);
  const key = randomUUID();
  const sessionID = randomUUID();

  const accessToken = createToken(
    { id: id, sessionID: sessionID },
    key,
    ms('5MIN'),
  );
  const refreshToken = createToken({ sessionID: sessionID }, key, ms('1DAY'));
  await createSession({
    id: id,
    sessionID: sessionID,
    key: key,
    deathTime: Date.now() + 24 * 60 * 60 * 1000,
  });

  res
    .cookie('accessToken', accessToken, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
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
