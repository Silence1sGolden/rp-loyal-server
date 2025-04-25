import { getProfileByID, likeProfile } from '@/db/profiles/profiles';
import { TAccessTokenBody } from '@/db/sessions/types';
import { getCookie } from '@/utils/cookie';
import { CustomError, ERROR_MESSAGE } from '@/utils/service';
import { checkAccessTokenHandler, getTokenPayload } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const likesRouter = Router();

likesRouter.use(checkAccessTokenHandler);

likesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    return CustomError(res, 400, 'ID не найдено.');
  }

  const payload = getTokenPayload<TAccessTokenBody>(
    getCookie('accessToken', req.headers.cookie!)!,
  );

  try {
    const profile = await getProfileByID(id);

    if (!profile) {
      return CustomError(res, 400, 'Профиль с таким ID не найден.');
    }

    await likeProfile(id, payload.id);

    res.status(200).send({ status: true, data: null });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
