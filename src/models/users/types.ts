import { RowDataPacket } from 'mysql2';

export type TLoginBody = {
  email: string;
  password: string;
};

export type TRegBody = {
  email: string;
  password: string;
  username: string;
};

export type TAuthTokenPayload = { user_id: number };
export type TRefreshTokenPayload = { session_id: number };

export type TUserRow = RowDataPacket & TUser;
export type TUser = {
  id: number;
  username: string;
  email: string;
  is_activated: string;
  pass_hash: string;
};

export type TSessionRow = RowDataPacket & TSession;
export type TSession = {
  id: number;
  user_id: number;
  expires_at: string;
};
