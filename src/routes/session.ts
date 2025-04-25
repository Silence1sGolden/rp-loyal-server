import { deleteSession, getSession } from '@/db/sessions/sessions';
import { TRefreshTokenBody } from '@/db/sessions/types';
import { authUserWithResponse } from '@/utils/service';
import { CustomError, ERROR_MESSAGE } from '@/utils/service';
import { getTokenPayload } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const refreshToken: UUID = req.body.refreshToken;

  if (!refreshToken) {
    return CustomError(res, 400, 'Токен не найден.');
  }

  const { sessionID } = getTokenPayload<TRefreshTokenBody>(refreshToken);

  try {
    const session = await getSession(sessionID);
    await deleteSession(sessionID);
    authUserWithResponse(res, session!.id);
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
