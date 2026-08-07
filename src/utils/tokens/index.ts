import { TAuthTokenPayload, TRefreshTokenPayload } from '@/models/users/types';
import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const SECRET: Secret = process.env.SECRET || 'secret';

const createToken = <T extends TAuthTokenPayload | TRefreshTokenPayload>(
  payload: T,
  expriresIn: number,
): string => {
  return jwt.sign(payload, SECRET, { expiresIn: expriresIn });
};

export function createRefreshToken(session_id: number) {
  return createToken({ session_id }, 7 * 24 * 60 * 60 * 1000);
}

export function createAuthToken(user_id: number) {
  return createToken({ user_id }, 15 * 60 * 1000);
}

export const verifyToken = <T extends TAuthTokenPayload | TRefreshTokenPayload>(
  token: string,
): T | undefined => {
  try {
    const check = jwt.verify(token, SECRET);

    return check as T;
  } catch (error) {
    console.error(error);
  }
};
