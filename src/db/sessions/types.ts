export type TSession = Record<string, TSessionTokens>;

export type TSessionTokens = {
  accessToken: string;
  refreshToken: string;
};
