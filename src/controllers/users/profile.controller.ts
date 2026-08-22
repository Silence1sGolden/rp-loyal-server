import { getProfileByUserID } from '@/services/profiles/profiles.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const profileController: RequestHandler = async (req, res) => {
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 404 });
  }

  try {
    const profile = await getProfileByUserID(userID);

    if (!profile) {
      return CustomError(res, { code: 404 });
    }

    CustomResponse(res, {
      code: 200,
      data: profile,
    });
  } catch (error) {
    return CustomError(res, { code: 500 });
  }
};
