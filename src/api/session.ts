import { deleteSession, getSession } from '@/db/sessions';
import { ITokenBody } from '@/models/token';
import { CustomError } from '@/utils/service';
import { getTokenPayload } from '@/utils/token';
import { Router } from 'express';

export const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    CustomError(res, 400, 'Токен не найден.');
    return;
  }

  try {
    const payload = getTokenPayload<ITokenBody>(refreshToken);

    if (!payload.sessionID) {
      CustomError(res, 400, 'Токен не действителен.');
      return;
    }

    const session = await getSession(payload.userID, payload.sessionID);

    if (!session) {
      CustomError(res, 400, 'Сессия не найдена.');
      return;
    }

    await deleteSession(payload.userID, payload.sessionID);
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
    return;
  }
});
