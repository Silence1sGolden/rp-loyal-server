import { CustomError } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const linkValidate: RequestHandler = async (req, res, next) => {
  const { jwtlink } = req.params;

  if (!jwtlink || Array.isArray(jwtlink)) {
    return CustomError(res, { code: 404 });
  }

  res.locals.jwtlink = jwtlink;
  next();
};
