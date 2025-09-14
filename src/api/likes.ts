import { getProfileByID, likeProfile } from '@/db/profiles';
import { TAccessTokenBody } from '@/db/sessions/types';
import { CustomError } from '@/utils/service';
import { getTokenPayload, verifyTokenHandler } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const likesRouter = Router();

likesRouter.use(verifyTokenHandler);

likesRouter.get('/:id', async (req, res) => {
  const targetID = req.params.id as UUID;

  if (!targetID) {
    CustomError(res, 400);
    return;
  }

  // eslint-disable-next-line
  const token = req.headers.authorization!;
  const { id } = getTokenPayload<TAccessTokenBody>(token);

  try {
    const profile = await getProfileByID(id);

    if (!profile) {
      CustomError(res, 400);
      return;
    }

    await likeProfile(id, targetID);

    res.status(200).send({ status: true, data: null });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
