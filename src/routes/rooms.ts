import {
  createRooms,
  deleteRooms,
  getRooms,
  getRoomsByID,
  updateRooms,
} from '@/db/rooms/rooms';
import { TRooms } from '@/db/rooms/types';
import { TAccessTokenBody } from '@/db/sessions/types';
import {
  checkAccessTokenHandler,
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getTokenPayload,
} from '@/utils/service';
import { randomUUID, UUID } from 'crypto';
import { RequestHandler, Router } from 'express';

export const roomsRouter = Router();

roomsRouter.use(checkAccessTokenHandler);

// TODO
// Должен выдавать список комнат привязанных к пользователю
roomsRouter.get('/', async (req, res) => {
  try {
    const rooms = await getRooms();

    res.status(200).send({ status: true, data: rooms });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

roomsRouter.get('/:id', async (req, res) => {
  const id = req.params.id as UUID;

  if (!id) {
    return CustomError(res, 400, 'ID комнаты не найден.');
  }

  try {
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      return CustomError(res, 404, 'Комнаты с таким ID не найдена.');
    }

    res.status(200).send({ status: true, data: rooms });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

roomsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id as UUID;
  const accessToken = req.headers.authorization as string;

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найден.');
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      return CustomError(res, 404, 'Ролка с таким ID не найдена.');
    }

    if (rooms._id !== payload.id) {
      return CustomError(res, 401, 'Недостаточно прав.');
    }

    await deleteRooms(id);

    res.status(200).send({ status: true, data: 'Ролка удалена.' });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

roomsRouter.post('/:id', async (req, res) => {
  const id = req.params.id as UUID;
  const data = req.body as TRooms;
  const accessToken = req.headers.authorization as string;
  const check = checkFields(data, ['roomsIMG', 'title', 'tags', 'description']);

  if (!id) {
    return CustomError(res, 400, 'ID ролки не найден.');
  }

  if (check) {
    return CustomError(res, 400, check);
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      return CustomError(res, 400, 'Ролка с таким ID не найдена.');
    }

    if (rooms._id !== payload.id) {
      return CustomError(res, 400, 'Недостаточно прав.');
    }

    await updateRooms(id, data);
    const newRooms = await getRoomsByID(id);

    res.status(200).send({ status: true, data: newRooms });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

export const createRoom: RequestHandler = async (req, res) => {
  const data = req.body as TRooms;
  const accessToken = req.headers.authorization as string;
  const check = checkFields(data, ['roomsIMG', 'title']);

  if (check) {
    return CustomError(res, 400, check);
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const roomsID = randomUUID();

    await createRooms({
      _id: roomsID,
      users: [payload.id],
      title: data.title,
      roomsIMG: data.roomsIMG,
      messages: [],
      discussion: [],
      tags: data.tags,
      description: data.description,
    });

    const newRooms = await getRoomsByID(roomsID);

    res.status(200).send({ status: true, data: newRooms });
  } catch (error) {
    return CustomError(res, 500, ERROR_MESSAGE, error);
  }
};
