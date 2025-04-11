import { UUID } from 'crypto';

export type TUser = {
  _id: string;
  username: string;
  email: string;
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
  name: string;
  message: string;
  sendAt: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TRegister = {
  email: string;
  username: string;
  password: string;
};

export type TEmail = {
  verify: boolean;
  key?: TEmailToken;
  email: string;
};

export type TEmailToken = {
  key: UUID;
  createdAt: number;
};
