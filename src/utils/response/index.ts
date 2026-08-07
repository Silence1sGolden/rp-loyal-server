import { Response } from 'express';
import { TErrorCodes, TSuccesCodes } from '../types';
import { RESPONSES } from './constants';

export function CustomError(
  res: Response,
  other?: {
    code?: TErrorCodes;
    logger?: any;
    message?: string;
  },
) {
  const code = other?.code || 500;
  const message = other?.message || RESPONSES[code];
  res.status(code).send(message);

  if (other?.logger) {
    console.error(other.logger);
  }
}

export function CustomResponse(
  res: Response,
  other?: {
    code?: TSuccesCodes;
    message?: string;
  },
) {
  const code = other?.code || 200;
  const message = other?.message || RESPONSES[code];
  res.status(code).send(message);
}
