import { RowDataPacket } from 'mysql2';

export type TProfileRow = RowDataPacket & TProfile;
export type TProfile = {
  nickname: string;
  avatar: string;
  about: string;
  status: TAvailbleStatus;
  time: TAvailbleTime;
};

export type TStatsRow = RowDataPacket & TStats;
export type TStats = {
  user_id: number;
  stories: number;
  turns: number;
};

export type TFriendsRow = RowDataPacket & TFriends;
export type TFriends = {
  partners: number;
};

export type TAvailbleStatus = 'active' | 'inactive';
export type TAvailbleTime = 'mins' | 'hours' | 'days';
