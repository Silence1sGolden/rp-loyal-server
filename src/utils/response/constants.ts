import { TCodes, TErrorResponse, TSuccessResponse } from '../types';

export const RESPONSES: Record<TCodes, TSuccessResponse | TErrorResponse> = {
  200: {
    status: 200,
    message: 'OK',
  },
  201: {
    status: 201,
    message: 'Created',
  },
  400: {
    status: 400,
    error: 'Bad Request',
  },
  401: {
    status: 401,
    error: 'Unauthorized',
  },
  403: {
    status: 403,
    error: 'Forbidden',
  },
  404: {
    status: 404,
    error: 'Not Found',
  },
  500: {
    status: 500,
    error: 'Internal Server Error',
  },
};
