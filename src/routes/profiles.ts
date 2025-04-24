import { deleteSession } from '@/db/sessions/sessions';
import { TAccessTokenBody } from '@/db/sessions/types';
import { TProfile } from '@/db/profiles/types';
import {
  deleteProfile,
  getProfileByID,
  updateProfile,
} from '@/db/profiles/profiles';
import {
  checkAccessTokenHandler,
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getCookie,
  getTokenPayload,
} from '@/utils/service';
import { UUID } from 'crypto';
import { Router } from 'express';

export const profilesRouter = Router();

profilesRouter.use(checkAccessTokenHandler);

profilesRouter.get('/', async (req, res) => {
  const accessToken = req.cookies.accessToken as string;
  const { id } = getTokenPayload<TAccessTokenBody>(accessToken);

  try {
    const profile = await getProfileByID(id);

    if (!profile) {
      return CustomError(
        res,
        400,
        'Профиль не найден',
        'Запрошен профиль с токеном доступа без найденного профиля',
      );
    }

    res.status(200).send({ status: true, data: profile });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

profilesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    return CustomError(res, 400, 'ID пользователя не определён.');
  }

  try {
    const user = await getProfileByID(id);

    if (!user) {
      return CustomError(res, 404, 'Пользователь с таким id не найден.');
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
    return CustomError(res, 400, 'Тело запроса некорректно.');
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const { id } = getTokenPayload<TAccessTokenBody>(token);

  try {
    await updateProfile(id, data);
    const newProfile = await getProfileByID(id);

    res.status(200).send({ status: true, data: newProfile });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

profilesRouter.delete('/', async (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const { id, sessionID } = getTokenPayload<TAccessTokenBody>(token);

  try {
    await deleteSession(sessionID);
    await deleteProfile(id);

    res.status(200).send({ status: true, data: 'Профиль удалён.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

// TODO
// app.post('/api/v1/profile/roles', createRolesHandler);
