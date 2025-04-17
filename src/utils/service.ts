import { Response } from 'express';
import { TProfile, TUser } from './types';
import * as dotenv from 'dotenv';
import { deleteCode, getCodes } from '@/db/codes/codes';
import jwt, { Secret } from 'jsonwebtoken';

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
    res.status(resErrorCode).json({ message: resErrorText });
    if (resErrorCode >= 500) {
      throw new Error(`ОШИБКА ${resErrorCode}: ${devError}`);
    }
  } else {
    res.status(505).json({ message: resErrorText });
    throw new Error(`ОШИБКА 505: ${devError}`);
  }
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

export function createNewProfile(id: string, useranme: string): TProfile {
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

export function createNewUser(
  id: string,
  email: string,
  username: string,
): TUser {
  return {
    _id: id,
    email: email,
    username: username,
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
  expriresIn: number,
): string => {
  return jwt.sign(payload, SECRET, { expiresIn: expriresIn });
};

export const verifyToken = <T>(token: string): T => {
  return jwt.verify(token, SECRET) as T;
};
