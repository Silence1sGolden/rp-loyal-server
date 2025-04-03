import { Response } from 'express';

export function CustomError(
  res: Response,
  errorCode?: number,
  errorText?: string,
) {
  if (errorCode && errorText) {
    res.status(errorCode).send({ error: errorText });
  } else {
    res.status(505).send({ error: 'Server error' });
  }
}

export function checkFields<T>(obj: any, fields: (keyof T)[]): string | null {
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
