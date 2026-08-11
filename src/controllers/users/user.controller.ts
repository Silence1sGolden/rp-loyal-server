import { GetUserByID } from '@/services/users/users.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const getUser: RequestHandler = async (req, res) => {
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 404 });
  }

  try {
    const user = await GetUserByID(userID);

    if (!user) {
      return CustomError(res, { code: 404 });
    }

    CustomResponse(res, {
      code: 200,
      data: { username: user.username, email: user.email },
    });
  } catch (error) {
    return CustomError(res, { code: 500 });
  }
};
