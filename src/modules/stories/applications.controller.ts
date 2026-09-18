import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { StoryIDParamsSchema } from '@/modules/stories/stories.schema.js';
import { UserIDLocalsSchema } from '@/utils/schema/user.schema.js';
import { RequestHandler } from 'express';
import {
  ApplicationDecisionBodySchema,
  ApplicationIDParamsSchema,
} from './applications.schema.js';
import { REQUESTS } from '@/utils/mock/index.js';

export const GetStoryApplicationsController: RequestHandler = async (
  req,
  res,
) => {
  const params = StoryIDParamsSchema.safeParse(req.params);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!params.success || !locals.success) {
    return CustomError(res, {
      code: 400,
      error: params.error?.message || params.error?.message,
    });
  }

  return CustomResponse(res, {
    data: {
      applications: REQUESTS,
    },
  });
};

export const DecisionApplicaionController: RequestHandler = async (
  req,
  res,
) => {
  const params = ApplicationIDParamsSchema.safeParse(req.params);
  const body = ApplicationDecisionBodySchema.safeParse(req.body);

  if (!body.success || !params.success) {
    return CustomError(res, {
      code: 400,
      error: body.error?.message || params.error?.message,
    });
  }

  return CustomResponse(res);
};
