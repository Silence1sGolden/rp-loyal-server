import { RowDataPacket } from 'mysql2';

export type TUserRow = RowDataPacket & TUser;
export type TUser = {
  user_id: number;
  username: string;
  email: string;
  is_activated: number;
  pass_hash: string;
};
