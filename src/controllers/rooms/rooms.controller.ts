import { getRoomsByID } from '@/services/rooms/rooms.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const roomsController: RequestHandler = async (_, res) => {
  const user_id = res.locals.userID;

  if (!user_id) {
    return CustomError(res, { code: 401 });
  }

  try {
    const rooms = await getRoomsByID(user_id);

    if (!rooms) {
      return CustomError(res, { code: 404 });
    }

    CustomResponse(res, {
      code: 200,
      data: {
        rooms,
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};
