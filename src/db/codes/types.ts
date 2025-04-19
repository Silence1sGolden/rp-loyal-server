import { UUID } from 'crypto';

export type TCodeEmail = {
  _id: UUID;
  createdAt: number;
  email?: string;
  password?: string;
  username?: string;
};

export type TCodeVerify = Record<number, TCodeEmail>;
