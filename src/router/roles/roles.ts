import {
  createRoles,
  deleteRoles,
  getRolesByID,
  updateRoles,
} from '@/db/roles/roles';
import { TRoles } from '@/db/roles/types';
import { TAccessTokenBody } from '@/db/sessions/types';
import {
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getTokenPayload,
} from '@/utils/service';
import { randomUUID, UUID } from 'crypto';
import { RequestHandler } from 'express';

export const getRolesByIDHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найден.');
  }

  try {
    const roles = await getRolesByID(id);

    if (!roles) {
      return CustomError(res, 404, 'Ролка с таким ID не найдена.');
    }

    res.status(200).send({ status: true, data: roles });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error);
  }
};

export const deleteRolesHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as UUID;
  const accessToken = req.headers.authorization as string;

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найден.');
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const roles = await getRolesByID(id);

    if (!roles) {
      return CustomError(res, 404, 'Ролка с таким ID не найдена.');
    }

    if (roles._id !== payload.id) {
      return CustomError(res, 401, 'Недостаточно прав.');
    }

    await deleteRoles(id);

    res.status(200).send({ status: true, data: 'Ролка удалена.' });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
};

export const updateRolesHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as UUID;
  const data = req.body as TRoles;
  const accessToken = req.headers.authorization as string;
  const check = checkFields(data, [
    'rolesImage',
    'title',
    'tags',
    'description',
  ]);

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найден.');
  }

  if (check) {
    return CustomError(res, 400, check);
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const roles = await getRolesByID(id);

    if (!roles) {
      return CustomError(res, 404, 'Ролка с таким ID не найдена.');
    }

    if (roles._id !== payload.id) {
      return CustomError(res, 401, 'Недостаточно прав.');
    }

    await updateRoles(id, data);
    const newRoles = await getRolesByID(id);

    res.status(200).send({ status: true, data: newRoles });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
};

export const createRolesHandler: RequestHandler = async (req, res) => {
  const data = req.body as TRoles;
  const accessToken = req.headers.authorization as string;
  const check = checkFields(data, ['rolesImage', 'title']);

  if (check) {
    return CustomError(res, 400, check);
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const rolesID = randomUUID();

    await createRoles({
      _id: rolesID,
      users: [payload.id],
      title: data.title,
      rolesImage: data.rolesImage,
      messages: [],
      tags: data.tags,
      description: data.description,
    });

    const newRoles = await getRolesByID(rolesID);

    res.status(200).send({ status: true, data: newRoles });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
};
