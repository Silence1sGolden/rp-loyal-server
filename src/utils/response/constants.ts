import {
  TErrorCodes,
  TErrorResponse,
  TSuccesCodes,
  TSuccessResponse,
} from '../types.js';

export const ERR_RESPONSES: Record<TErrorCodes, TErrorResponse> = {
  400: {
    message: 'Bad Request',
  },
  401: {
    message: 'Unauthorized',
  },
  403: {
    message: 'Forbidden',
  },
  404: {
    message: 'Not Found',
  },
  500: {
    message: 'Internal Server Error',
  },
};

export const RESPONSES: Record<TSuccesCodes, TSuccessResponse> = {
  200: {
    message: 'OK',
  },
  201: {
    message: 'Created',
  },
};
