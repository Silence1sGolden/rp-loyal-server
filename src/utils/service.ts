import { Response } from 'express';
import { TProfile } from '@/db/profiles/types';
import { randomUUID, UUID } from 'crypto';
import { createSession, deleteSession, getSessionByID } from '@/db/sessions';
import ms from 'ms';
import { createToken } from './token';
import { defaultErrors } from '@/data/errors';

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

export function getBlankProfile(): TProfile {
  return {
    _id: randomUUID(),
    username: '',
    profileIMG: '',
    backgroundIMG: '',
    about: '',
    stats: {
      likes: [],
      fans: [],
      rewards: [],
    },
    status: '',
    likesTags: [],
    roles: [],
  };
}

export const getKeysOfObject = <T extends object, A extends keyof T>(
  data: T,
): A[] => {
  return Object.keys(data) as A[];
};

export const setAuthUser = async (
  id: UUID,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const elseSessions = await getSessionByID(id);

  if (elseSessions) {
    deleteSession(elseSessions.sessionID);
  }

  const key = randomUUID();
  const sessionID = randomUUID();

  const accessToken = createToken(
    { id: id, sessionID: sessionID },
    key,
    Date.now() + ms('5MIN'),
  );
  const refreshToken = createToken(
    { sessionID: sessionID },
    key,
    Date.now() + ms('24HOUR'),
  );

  await createSession({
    id: id,
    sessionID: sessionID,
    key: key,
    deathTime: Date.now() + ms('24HOUR'),
  });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
