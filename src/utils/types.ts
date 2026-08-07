export type TErrorCodes = 400 | 401 | 403 | 404 | 500;
export type TSuccesCodes = 200 | 201;
export type TCodes = TErrorCodes | TSuccesCodes;

export type TErrorResponse = {
  status: TErrorCodes;
  error: string;
  message?: string;
};

export type TSuccessResponse = {
  status: TSuccesCodes;
  message: string;
};
