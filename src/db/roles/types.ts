import { UUID } from 'crypto';

export type TRoles = {
  _id: UUID;
  users: UUID[];
  description: string;
  title: string;
  rolesImage: string;
  tags: string[];
  messages: TMessage[];
};

export type TMessage = {
  _id: UUID;
  author: string;
  authorIMG: string;
  message: string;
  sendAt: string;
};
