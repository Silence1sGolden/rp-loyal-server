import { getRolesByID } from '@/db/roles';
import { deleteRoomByID, getRoomByID, getRoomsByUserID } from '@/db/rooms';
import { ITokenBody } from '@/models/token';
import { CustomError } from '@/utils/service';
import { getTokenPayload, verifyTokenHandler } from '@/utils/token';
import { UUID } from 'crypto';
import { Router } from 'express';

export const roomsRouter = Router();

roomsRouter.use(verifyTokenHandler);

roomsRouter.get('/', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    CustomError(res, 401);
    return;
  }

  const payload = getTokenPayload<ITokenBody>(token);

  if (!payload) {
    CustomError(res, 401);
    return;
  }

  try {
    const rolesID = await getRoomsByUserID(payload.userID);

    res.status(200).send({ status: true, data: rolesID });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

roomsRouter.get('/:id', async (req, res) => {
  const roomID = req.params.id as UUID;

  if (!roomID) {
    CustomError(res, 404);
    return;
  }

  try {
    const room = await getRoomByID(roomID);

    if (!room) {
      CustomError(res, 404);
      return;
    }

    const roles = await getRolesByID(room.rolesID);

    if (!roles) {
      CustomError(res, 404);
      return;
    }

    res.status(200).send({ status: true, data: roles });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

roomsRouter.delete('/:id', async (req, res) => {
  const roomID = req.params.id as UUID;
  // eslint-disable-next-line
  const accessToken = req.headers.authorization!;

  if (!roomID) {
    CustomError(res, 404);
    return;
  }

  try {
    const { userID } = getTokenPayload<ITokenBody>(accessToken);
    const room = await getRoomByID(roomID);

    if (!room) {
      CustomError(res, 404, 'Ролка с таким ID не найдена.');
      return;
    }

    const admin = room.users.find((item) => item.permission === 'admin');

    if (!admin || admin.userID !== userID) {
      CustomError(res, 403);
      return;
    }

    await deleteRoomByID(roomID);

    res.status(200).send({ status: true, data: 'Room was deleted.' });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
