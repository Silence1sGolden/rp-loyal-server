import { UUID } from 'crypto';

export type TProfile = TProfileForChange & {
  _id: UUID;
  stats: TStats;
  forms: TRolesForm[];
  isDeleted?: boolean;
  isBanned?: boolean;
};

export type TProfileForChange = {
  username: string;
  profileIMG: string;
  about: string;
  status: string;
  likesTags: string[];
};

export type TDeletedProfile = {
  _id: UUID;
  profile: TProfile;
  deleteAt: number;
  reason?: string;
};

export type TBannedProfile = {
  _id: UUID;
  profile: TProfile;
  bannedAt: number;
  reason: string;
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
