import { deleteSession, getSessionByID } from '@/db/sessions/sessions';
import { TRefreshTokenBody } from '@/db/sessions/types';
import { authUserWithResponse } from '@/utils/service';
import { CustomError, ERROR_MESSAGE } from '@/utils/service';
import { getTokenPayload } from '@/utils/token';
import { Router } from 'express';

export const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    CustomError(res, 400, 'Токен не найден.'); return;
  }

  try {
    const payload = getTokenPayload<TRefreshTokenBody>(refreshToken);

    if (!payload.sessionID) {
      CustomError(res, 400, 'Токен не действителен.'); return;
    }

    const session = await getSessionByID(payload.sessionID);

    if (!session) {
      CustomError(res, 400, 'Сессия не найдена.'); return;
    }

    await deleteSession(payload.sessionID);
    authUserWithResponse(res, session.id);
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err); return;
  }
});
