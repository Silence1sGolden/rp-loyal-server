import { UUID } from 'crypto';

export type TProfile = {
  _id: UUID;
  username: string;
  profileIMG: string;
  about: string;
  stats: TStats;
  status: string;
  likesTags: string[];
  forms: TRolesForm[];
};

export type TStats = {
  likes: string[];
  rewards: string[];
  fans: string[];
};

export type TRolesForm = {
  _id: UUID;
  title: string;
  author: TProfile;
  tags: string[];
  about: string;
  rolesIMG: string;
};
