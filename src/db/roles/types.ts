import { UUID } from 'crypto';

export type TRoles = IRolesForChange & {
  _id: UUID;
  author: UUID;
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
