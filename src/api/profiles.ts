import { TAccessTokenBody } from '@/db/sessions/types';
import { IProfileForChange } from '@/db/profiles/types';
import { getProfileByID, updateProfile } from '@/db/profiles';
import { checkFields, CustomError } from '@/utils/service';
import { UUID } from 'crypto';
import { Router } from 'express';
import { getTokenPayload, verifyTokenHandler } from '@/utils/token';

export const profilesRouter = Router();

profilesRouter.use(verifyTokenHandler);

profilesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    CustomError(res, 400);
    return;
  }

  try {
    const user = await getProfileByID(id);

    if (!user) {
      CustomError(res, 404);
      return;
    }

    res.status(200).send({ status: true, data: user });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

profilesRouter.post('/:id', async (req, res) => {
  const targetID = req.params.id as UUID;

  if (!targetID) {
    CustomError(res, 400);
    return;
  }

  // eslint-disable-next-line
  const token = req.headers.authorization!;
  const { id } = getTokenPayload<TAccessTokenBody>(token);

  if (targetID !== id) {
    CustomError(res, 400);
    return;
  }

  const data = req.body as IProfileForChange;
  const check = checkFields(data, [
    'about',
    'likesTags',
    'background',
    'status',
    'username',
    'avatar',
  ]);

  if (check) {
    CustomError(res, 400);
    return;
  }

  try {
    await updateProfile(id, data);
    const newProfile = await getProfileByID(id);

    res.status(200).send({ status: true, data: newProfile });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

// profilesRouter.delete('/:id', async (req, res) => {
//   const cookie = req.headers.cookie;

//   if (!cookie) {
//     CustomError(res, 401, 'Вы не авторизованы.');
//     return;
//   }

//   const token = getCookie('accessToken', cookie);

//   if (!token) {
//     CustomError(res, 401, 'Вы не авторизованы.');
//     return;
//   }

//   const { id, sessionID } = getTokenPayload<TAccessTokenBody>(token);

//   try {
//     await deleteSession(sessionID);
//     await deleteProfile(id);
//     const user = await getEmailByID(id);
//     await deleteEmailByID(id);
//     await deletePassword(user!.email);

//     res.status(200).send({ status: true, data: 'Профиль удалён.' });
//   } catch (err) {
//     console.log(err);
//     CustomError(res, 500);
//   }
// });

// TODO
// app.post('/api/v1/profile/roles', createRolesHandler);
