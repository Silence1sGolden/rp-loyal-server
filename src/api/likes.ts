import { ERROR_MESSAGE } from '@/data/constans';
import { getProfileByID, likeProfile } from '@/db/profiles';
import { TAccessTokenBody } from '@/db/sessions/types';
import { getCookie } from '@/utils/cookie';
import { checkFields, CustomError } from '@/utils/service';
import { getTokenPayload, verifyTokenHandler } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const likesRouter = Router();

likesRouter.use(verifyTokenHandler);

likesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    CustomError(res, 400);
    return;
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    CustomError(res, 401);
    return;
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    CustomError(res, 401);
    return;
  }

  const payload = getTokenPayload<TAccessTokenBody>(token);
  const check = checkFields(payload, ['id', 'sessionID']);

  if (check) {
    CustomError(res, 401);
    return;
  }

  try {
    const profile = await getProfileByID(id);

    if (!profile) {
      CustomError(res, 400);
      return;
    }

    await likeProfile(id, payload.id);

    res.status(200).send({ status: true, data: null });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
    return;
  }
});
