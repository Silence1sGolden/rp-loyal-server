import {
  createRooms,
  deleteRooms,
  getRooms,
  getRoomsByID,
  updateRooms,
} from '@/db/rooms/rooms';
import { TRooms } from '@/db/rooms/types';
import { TAccessTokenBody } from '@/db/sessions/types';
import { checkFields, CustomError, ERROR_MESSAGE } from '@/utils/service';
import { checkAccessTokenHandler, getTokenPayload } from '@/utils/token';
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
    CustomError(res, 400, 'ID комнаты не найден.'); return;
  }

  try {
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      CustomError(res, 404, 'Комнаты с таким ID не найдена.'); return;
    }

    res.status(200).send({ status: true, data: rooms });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error);
  }
});

roomsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id as UUID;
  const accessToken = req.headers.authorization!;

  if (!id) {
    CustomError(res, 400, 'ID ролки не найден.'); return;
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      CustomError(res, 404, 'Ролка с таким ID не найдена.'); return;
    }

    if (rooms._id !== payload.id) {
      CustomError(res, 401, 'Недостаточно прав.'); return;
    }

    await deleteRooms(id);

    res.status(200).send({ status: true, data: 'Ролка удалена.' });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error); return;
  }
});

roomsRouter.post('/:id', async (req, res) => {
  const id = req.params.id as UUID;
  const data = req.body as TRooms;
  const accessToken = req.headers.authorization!;
  const check = checkFields(data, ['roomsIMG', 'title', 'tags', 'description']);

  if (!id) {
    CustomError(res, 400, 'ID ролки не найден.'); return;
  }

  if (check) {
    CustomError(res, 400, check); return;
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(accessToken);
    const rooms = await getRoomsByID(id);

    if (!rooms) {
      CustomError(res, 400, 'Ролка с таким ID не найдена.'); return;
    }

    if (rooms._id !== payload.id) {
      CustomError(res, 400, 'Недостаточно прав.'); return;
    }

    await updateRooms(id, data);
    const newRooms = await getRoomsByID(id);

    res.status(200).send({ status: true, data: newRooms });
  } catch (error) {
    CustomError(res, 500, ERROR_MESSAGE, error); return;
  }
});

export const createRoom: RequestHandler = async (req, res) => {
  const data = req.body as TRooms;
  const accessToken = req.headers.authorization!;
  const check = checkFields(data, ['roomsIMG', 'title']);

  if (check) {
    CustomError(res, 400, check); return;
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
    CustomError(res, 500, ERROR_MESSAGE, error); return;
  }
};
