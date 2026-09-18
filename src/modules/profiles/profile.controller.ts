import { db } from '@/db.js';
import { getProfileByUserID } from '@/modules/profiles/profiles.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { UserIDLocalsSchema } from '@/utils/schema/user.schema.js';
import { RequestHandler } from 'express';
import { ProfileIDParamsSchema } from './profile.schema.js';
import { GetShortStoriesByAuthorID } from '../stories/stories.service.js';

export const GetProfileController: RequestHandler = async (req, res) => {
  const params = ProfileIDParamsSchema.safeParse(req.params);

  if (!params.success) {
    return CustomError(res, { code: 400, error: params.error.message });
  }

  try {
    const profile = await getProfileByUserID(db, params.data.profileID);

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

export const GetMyProfileController: RequestHandler = async (_, res) => {
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!locals.success) {
    return CustomError(res, { code: 400, error: locals.error.message });
  }

  try {
    const profile = await getProfileByUserID(db, locals.data.userID);

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

export const GetProfileStoriesController: RequestHandler = async (req, res) => {
  const params = ProfileIDParamsSchema.safeParse(req.params);

  if (!params.success) {
    return CustomError(res, { code: 400, error: params.error.message });
  }

  try {
    const stories = await GetShortStoriesByAuthorID(db, params.data.profileID);

    CustomResponse(res, {
      code: 200,
      data: {
        stories: stories,
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};
