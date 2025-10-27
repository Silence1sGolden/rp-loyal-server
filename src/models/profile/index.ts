import { UUID } from 'crypto';

export type TProfile = IProfileForChange & {
  userID: number;
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
