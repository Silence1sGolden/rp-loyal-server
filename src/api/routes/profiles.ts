import { deleteSession } from '@/db/sessions/sessions';
import { TAccessTokenBody } from '@/db/sessions/types';
import { TProfile } from '@/db/profiles/types';
import {
  deleteProfile,
  getProfileByID,
  updateProfile,
} from '@/db/profiles/profiles';
import { checkFields, CustomError, ERROR_MESSAGE } from '@/utils/service';
import { UUID } from 'crypto';
import { Router } from 'express';
import { deleteEmailByID, getEmailByID } from '@/db/emails/emails';
import { deletePassword } from '@/db/passwords/passwords';
import { checkAccessTokenHandler, getTokenPayload } from '@/utils/token';
import { getCookie } from '@/utils/cookie';

export const profilesRouter = Router();

profilesRouter.use(checkAccessTokenHandler);

profilesRouter.get('/', async (req, res) => {
  const accessToken = req.headers.authorization!;
  const { id } = getTokenPayload<TAccessTokenBody>(accessToken);

  try {
    const profile = await getProfileByID(id);

    if (!profile) {
      CustomError(
        res,
        400,
        'Профиль не найден',
        'Запрошен профиль с токеном доступа без найденного профиля',
      ); return;
    }

    res.status(200).send({ status: true, data: profile });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error); return;
  }
});

profilesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    CustomError(res, 400, 'ID пользователя не определён.'); return;
  }

  try {
    const user = await getProfileByID(id);

    if (!user) {
      CustomError(res, 404, 'Пользователь с таким id не найден.'); return;
    }

    res.status(200).send({ status: true, data: user });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

profilesRouter.post('/', async (req, res) => {
  const data = req.body as TProfile;
  const check = checkFields(data, [
    'about',
    'likesTags',
    'profileIMG',
    'status',
    'username',
  ]);

  if (check) {
    CustomError(res, 400, 'Тело запроса некорректно.'); return;
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    CustomError(res, 401, 'Вы не авторизованы.'); return;
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    CustomError(res, 401, 'Вы не авторизованы.'); return;
  }

  const { id } = getTokenPayload<TAccessTokenBody>(token);

  try {
    await updateProfile(id, data);
    const newProfile = await getProfileByID(id);

    res.status(200).send({ status: true, data: newProfile });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err); return;
  }
});

profilesRouter.delete('/', async (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    CustomError(res, 401, 'Вы не авторизованы.'); return;
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    CustomError(res, 401, 'Вы не авторизованы.'); return;
  }

  const { id, sessionID } = getTokenPayload<TAccessTokenBody>(token);

  try {
    await deleteSession(sessionID);
    await deleteProfile(id);
    const user = await getEmailByID(id);
    await deleteEmailByID(id);
    await deletePassword(user!.email);

    res.status(200).send({ status: true, data: 'Профиль удалён.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

// TODO
// app.post('/api/v1/profile/roles', createRolesHandler);
