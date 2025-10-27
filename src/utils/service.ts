import { Response } from 'express';
import { defaultErrors } from '@/data/errors';
import { TProfile } from '@/models/profile';

export function getRandomCode(): number {
  return Math.round(Math.random() * (999999 - 100000) + 100000);
}

export function CustomError(
  res: Response,
  resErrorCode = 500,
  resErrorText?: string,
  devError?: unknown,
) {
  if (devError) console.error(`${resErrorCode}: ${devError}`);
  if (resErrorText) {
    res.status(resErrorCode).send({ error: resErrorText });
  } else {
    res.status(resErrorCode).send({ error: defaultErrors[resErrorCode] });
  }
}

export function checkFields<T>(obj: T, fields: (keyof T)[]): string | null {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return 'Data Not Available';
  }
  fields.forEach((key) => {
    if (!(key in obj) || !obj[key]) {
      return `Field ${String(key)} is missing.`;
    }
  });
  return null;
}

export function getBlankProfile(options?: Partial<TProfile>): TProfile {
  return {
    userID: 0,
    username: '',
    avatar: '',
    background: '',
    about: '',
    stats: {
      likes: [],
      fans: [],
      rewards: [],
    },
    status: '',
    likesTags: [],
    roles: [],
    ...options,
  };
}

export const getKeysOfObject = <T extends object, A extends keyof T>(
  data: T,
): A[] => {
  return Object.keys(data) as A[];
};
