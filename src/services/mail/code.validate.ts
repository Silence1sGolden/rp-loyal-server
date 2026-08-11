import { TCodeBody } from '@/models/mail/types.js';
import { CustomError } from '@/utils/response/index.js';
import { checkFields } from '@/utils/service.js';
import { RequestHandler } from 'express';

export const codeValidate: RequestHandler = async (req, res, next) => {
  const body: TCodeBody = req.body;

  if (checkFields(body, ['code', 'email'])) {
    return CustomError(res, { code: 400 });
  }

  res.locals.code = body;
  next();
};
