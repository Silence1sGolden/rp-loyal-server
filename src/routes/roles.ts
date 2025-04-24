import {
  deleteRoles,
  getRoles,
  getRolesByID,
  getRolesWithFilter,
  updateRoles,
} from '@/db/roles/roles';
import { TRolesForChange } from '@/db/roles/types';
import { TAccessTokenBody } from '@/db/sessions/types';
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

export const rolesRouter = Router();

rolesRouter.use(checkAccessTokenHandler);

rolesRouter.get('/', async (req, res) => {
  const { id } = getTokenPayload<TAccessTokenBody>(
    getCookie('acceessToken', req.headers.cookie!)!,
  );
  const filter = req.query;

  try {
    const roles = await getRolesWithFilter(id, filter);

    res.status(200).send({ status: true, data: roles });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

rolesRouter.use('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найдено.');
  }

  next();
});

rolesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  try {
    const role = await getRolesByID(id);

    if (!role) {
      return CustomError(res, 400, 'Ролка с таким ID не найдена.');
    }

    res.status(200).send({ status: true, data: role });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

rolesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  try {
    const role = await getRolesByID(id);

    if (!role) {
      return CustomError(res, 400, 'Ролка с таким ID не найдена.');
    }

    const userData = getTokenPayload<TAccessTokenBody>(
      getCookie('acceessToken', req.headers.cookie!)!,
    );

    if (role.author._id !== userData.id) {
      return CustomError(res, 400, 'Недостаточно прав.');
    }

    await deleteRoles(id);

    res.status(200).send({ status: true, data: 'Ролка удалена.' });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

rolesRouter.post('/:id', async (req, res) => {
  const data = req.body as TRolesForChange;
  const check = checkFields(data, [
    'about',
    'ganre',
    'rolesIMG',
    'tags',
    'title',
  ]);

  if (check) {
    return CustomError(res, 400, check);
  }

  const id = req.params.id as UUID;

  try {
    await updateRoles(id, data);
    const role = await getRolesByID(id);

    res.status(200).send({ status: true, data: role });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
