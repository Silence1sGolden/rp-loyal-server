import { Request, Response } from 'express';
import {
  createAuthToken,
  createRefreshToken,
  verifyToken,
} from '@/utils/tokens/index.js';
import {
  GetSessionByID,
  UpdateSessionByID,
} from '@/modules/auth/sessions.service.js';
import ms from 'ms';
import { db } from '@/db.js';
import { RefreshTokenPayload } from '@/models/schemas/users.js';

export async function refresh(req: Request, res: Response) {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    throw new Error('The refresh_token was not found.');
  }

  const session_id = verifyToken<RefreshTokenPayload>(
    refresh_token,
    'refresh',
  )?.session_id;

  if (!session_id) {
    throw new Error('The session_id was not found.');
  }

  const session = await GetSessionByID(db, session_id);

  if (!session) {
    throw new Error('The session was not found.');
  }

  const newAuthToken = createAuthToken(session.user_id);
  const newRefreshToken = createRefreshToken(session.id);

  await UpdateSessionByID(db, session.id);

  res.cookie('auth_token', newAuthToken, {
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
    maxAge: ms('15min'),
  });
  res.cookie('refresh_token', newRefreshToken, {
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
    maxAge: ms('7days'),
  });

  res.locals.userID = session.user_id;
}

export async function attachAuthTokens(
  res: Response,
  user_id: number,
  session_id: number,
) {
  const authToken = createAuthToken(user_id);
  const refreshToken = createRefreshToken(session_id);

  res.cookie('auth_token', authToken, {
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
    maxAge: ms('15min'),
  });
  res.cookie('refresh_token', refreshToken, {
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
    maxAge: ms('7days'),
  });
}
