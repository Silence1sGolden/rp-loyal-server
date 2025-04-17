import { UUID } from 'crypto';

export type TUser = {
  _id: string;
  username: string;
  email: string;
};

export type TProfile = {
  _id: string;
  username: string;
  profileIMG: string;
  about: string;
  stats: TStats;
  status: string;
  likesTags: string[];
  forms: TRolesForm[];
};

export type TPassword = Record<UUID, string>;

export type TStats = {
  likes: string[];
  rewards: string[];
  fans: string[];
};

export type TRolesForm = {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  about: string;
  rolesImage: string;
};

export type TRoles = {
  _id: string;
  title: string;
  rolesImage: string;
};

export type TMessage = {
  _id: string;
  author: string;
  authorIMG: string;
  message: string;
  sendAt: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TRegister = TLogin & {
  username: string;
};

export type TVerifyEmail = {
  email: string;
  key: UUID;
  createdAt: number;
};

export type TEmail = {
  _id: string;
  email: string;
  verify: boolean;
  active: null | TVerifyUser;
};

export type TVerifyUser = {
  accessToken: string;
  refreshToken: string;
};

export type TCodeEmail = {
  email: string;
  createdAt: number;
};

export type TCodeVerify = Record<number, TCodeEmail>;
