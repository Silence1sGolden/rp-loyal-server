import { getProfileByUserID } from '@/services/profiles.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const getProfileController: RequestHandler = async (req, res) => {
  const profileID = req.params.profileID;

  if (isNaN(+profileID)) {
    return CustomError(res, { code: 400 });
  }

  try {
    const profile = await getProfileByUserID(+profileID);

    if (!profile) {
      return CustomError(res, { code: 404 });
    }

    CustomResponse(res, {
      code: 200,
      data: profile,
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const getMyProfileController: RequestHandler = async (_, res) => {
  const userID = res.locals.userID;

  if (!userID || isNaN(+userID)) {
    return CustomError(res, { code: 400 });
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
    return CustomError(res, { logger: error });
  }
};
