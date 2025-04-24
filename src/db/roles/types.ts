import { UUID } from 'crypto';
import { TProfile } from '../profiles/types';

export type TRoles = TRolesForChange & {
  _id: UUID;
  author: TProfile;
};

export type TRolesForChange = {
  title: string;
  tags: string[];
  ganre: string[];
  about: string;
  rolesIMG: string;
};

export type TSearchParams = {
  tags?: string[];
  ganre?: string[];
  likes?: boolean;
  age?: {
    '16+'?: boolean;
    '18+'?: boolean;
    '21+'?: boolean;
  };
};
