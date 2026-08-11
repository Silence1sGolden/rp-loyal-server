import {
  TAuthTokenPayload,
  TRefreshTokenPayload,
} from '@/models/users/types.js';
import { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import ms from 'ms';

type TSecretName = 'auth' | 'refresh' | 'verify';

const AUTH_SECRET: Secret = process.env.AUTH_SECRET || 'AUTH_SECRET';
const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET || 'REFRESH_SECRET';
const VERIFIY_SECRET: Secret = process.env.VERIFIY_SECRET || 'VERIFIY_SECRET';

const SECRETS: Record<TSecretName, Secret> = {
  auth: AUTH_SECRET,
  refresh: REFRESH_SECRET,
  verify: VERIFIY_SECRET,
};

const createToken = <T extends TAuthTokenPayload | TRefreshTokenPayload>(
  payload: T,
  secret: Secret,
  expriresIn: number | ms.StringValue,
): string => {
  return jwt.sign(payload, secret, { expiresIn: expriresIn });
};

export function createRefreshToken(session_id: number) {
  return createToken({ session_id }, REFRESH_SECRET, '7days');
}

export function createAuthToken(user_id: number) {
  return createToken({ user_id }, AUTH_SECRET, '15min');
}

export function createVerifyToken(user_id: number) {
  return createToken({ user_id }, VERIFIY_SECRET, '15min');
}

export const verifyToken = <T extends TAuthTokenPayload | TRefreshTokenPayload>(
  token: string,
  secretName: TSecretName,
): T | undefined => {
  try {
    const check = jwt.verify(token, SECRETS[secretName]);

    return check as T;
  } catch (error) {
    console.error(error);
  }
};
