import { UUID } from 'crypto';

export type TRooms = {
  _id: UUID;
  users: UUID[];
  description: string;
  title: string;
  roomsIMG: string;
  tags: string[];
  messages: TMessage[];
  discussion: TMessage[];
};

export type TMessage = {
  _id: UUID;
  author: string;
  authorIMG: string;
  message: string;
  sendAt: string;
};
