import { createAuthToken, createRefreshToken } from '@/utils/tokens/index.js';
import { Response } from 'express';
import { CreateSession } from './sessions.service.js';
import ms from 'ms';

export async function attachAuthTokens(res: Response, user_id: number) {
  const session_id = await CreateSession(user_id);

  if (!session_id) {
    throw new Error('Error creating session.');
  }

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
