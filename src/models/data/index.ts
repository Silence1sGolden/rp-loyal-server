import { UUID } from 'crypto';

export interface TRoom {
  rolesID: UUID;
  users: IRoomUser[];
  createdAt: string;
  messages: TMessage[];
}

export interface IRoomUser {
  userID: number;
  permission: 'admin' | 'member';
}

export interface TMessage {
  roomID: UUID;
  userID: number;
  message: string;
  sendAt: string;
  updateAt: string;
}

export type TRoles = IRolesForChange & {
  _id: UUID;
  author: number;
};

export interface IRolesForChange {
  title: string;
  avatar: string;
  background: string;
  tags: string[];
  ganre: string[];
  description: string;
}

export interface ISearchParams {
  tags?: string[];
  ganre?: string[];
  likes?: boolean;
}
