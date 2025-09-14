import { UUID } from 'crypto';

export type TProfile = IProfileForChange & {
  _id: UUID;
  stats: IStats;
  roles: UUID[];
};

export interface IProfileForChange {
  username: string;
  avatar: string;
  background: string;
  about: string;
  status: string;
  likesTags: string[];
}

export interface IStats {
  likes: string[];
  rewards: string[];
  fans: string[];
}

// export interface TDeletedProfile {
//   _id: UUID;
//   profile: TProfile;
//   deleteAt: number;
//   reason: string;
// }

// export interface TBannedProfile {
//   _id: UUID;
//   profile: TProfile;
//   bannedAt: number;
//   reason: string;
// }
