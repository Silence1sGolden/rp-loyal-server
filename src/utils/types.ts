import { UUID } from 'crypto';

export type TRoles = {
  _id: UUID;
  title: string;
  rolesImage: string;
};

export type TMessage = {
  _id: UUID;
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
