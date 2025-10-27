import { getProfileByUserID, likeProfile } from '@/db/profiles';
import { TTokenBody } from '@/models/token';
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
  const { userID } = getTokenPayload<TTokenBody>(token);

  try {
    const profile = await getProfileByUserID(userID);

    if (!profile) {
      CustomError(res, 400);
      return;
    }

    await likeProfile(userID, targetID);

    res.status(200).send({ status: true, data: null });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
