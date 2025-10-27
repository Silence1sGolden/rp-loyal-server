import { UUID } from 'crypto';

export interface IUser {
  email: string;
  username: string;
  id: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  username: string;
  email: string;
  password: string;
}
// eslint-disable-next-line
export type TPasswords = Record<number, string>;
// eslint-disable-next-line
export type TSessions = Record<number, TSession[]>;
// eslint-disable-next-line
export type TSession = {
  id: UUID;
  sessionToken: UUID;
  refreshToken: UUID;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  deathTime: string;
};

export interface TCodeSession {
  _id: UUID;
  createdAt: number;
  email: string;
  password: string;
  username: string;
  code: number;
}

// eslint-disable-next-line
export type TPassword = Record<UUID, string>;
// eslint-disable-next-line
export type TResetLink = Record<string, number>;
