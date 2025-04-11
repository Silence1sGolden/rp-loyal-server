import { Response } from 'express';
import { TUser } from './types';
import * as dotenv from 'dotenv';

dotenv.config();
export const BASE_URL = process.env.BASE_URL || 'http://192.168.1.100:443';
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const ERROR_MESSAGE = 'У нас что-то сломалось, попробуйте позже ;(';

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
    if (resErrorCode >= 500) {
      throw new Error(`ОШИБКА ${resErrorCode}: ${devError}`);
    }
  } else {
    res.status(505).send({ error: 'Server error' });
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

export function createNewUser(
  id: string,
  useranme: string,
  email: string,
): TUser {
  return {
    _id: id,
    username: useranme,
    email: email,
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
