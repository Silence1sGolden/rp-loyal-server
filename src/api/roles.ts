import {
  deleteRoles,
  getRolesByID,
  getRolesWithFilter,
  updateRoles,
} from '@/db/roles';
import { IRolesForChange, ISearchParams } from '@/models/data';
import { TTokenBody } from '@/models/token';
import { getCookie } from '@/utils/cookie';
import { checkFields, CustomError } from '@/utils/service';
import { getTokenPayload } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const rolesRouter = Router();

// rolesRouter.use(checkAccessTokenHandler);

rolesRouter.get('/', async (req, res) => {
  // const { id } = getTokenPayload<TAccessTokenBody>(req.headers.authorization!);
  const query = req.query;
  const filter: ISearchParams = {
    ganre: query.ganre ? (query.ganre as string).split(',') : undefined,
    tags: query.tags ? (query.tags as string).split(',') : undefined,
  };

  try {
    const roles = await getRolesWithFilter('id' as UUID, filter);

    res.status(200).send({ status: true, data: roles });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});

rolesRouter.use('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    CustomError(res, 400, 'ID ролки не найдено.');
    return;
  }

  next();
});

rolesRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  try {
    const role = await getRolesByID(id);

    if (!role) {
      CustomError(res, 400, 'Ролка с таким ID не найдена.');
      return;
    }

    res.status(200).send({ status: true, data: role });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});

rolesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  try {
    const role = await getRolesByID(id);

    if (!role) {
      CustomError(res, 400, 'Ролка с таким ID не найдена.');
      return;
    }

    const userData = getTokenPayload<TTokenBody>(
      getCookie('acceessToken', req.headers.cookie!)!,
    );

    if (role.author !== userData.userID) {
      CustomError(res, 400, 'Недостаточно прав.');
      return;
    }

    await deleteRoles(id);

    res.status(200).send({ status: true, data: 'Ролка удалена.' });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});

rolesRouter.post('/:id', async (req, res) => {
  const data = req.body as IRolesForChange;
  const check = checkFields(data, [
    'description',
    'ganre',
    'avatar',
    'background',
    'tags',
    'title',
  ]);

  if (check) {
    CustomError(res, 400, check);
    return;
  }

  const id = req.params.id as UUID;

  try {
    await updateRoles(id, data);
    const role = await getRolesByID(id);

    res.status(200).send({ status: true, data: role });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});
