import { UUID } from 'crypto';
import { TMessage } from '../rooms/types';

export type TRoles = {
  _id: UUID;
  title: string;
  users: UUID[];
  messages: TMessage[];
  discussion: TMessage[];
  rolesIMG: string;
};
