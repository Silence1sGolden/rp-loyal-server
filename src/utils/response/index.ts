import { Response } from 'express';
import { TErrorCodes, TErrorResponse, TSuccesCodes } from '../types.js';
import { ERR_RESPONSES, RESPONSES } from './constants.js';

export function CustomError(
  res: Response,
  other?: {
    code?: TErrorCodes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger?: any;
    error?: string;
  },
) {
  const code = other?.code || 500;
  const error: TErrorResponse = other?.error
    ? { message: other.error }
    : ERR_RESPONSES[code];
  res.status(code).json(error);

  if (other?.logger) {
    console.error(other.logger);
  }
}

export function CustomResponse(
  res: Response,
  other?: {
    code?: TSuccesCodes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
  },
) {
  const code = other?.code || 200;
  const body = other?.data || RESPONSES[code];
  res.status(code).json(body);
}
