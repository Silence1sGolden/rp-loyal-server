export type TStats = {
  user_id: number;
  stories: number;
  turns: number;
};

export type TFriends = {
  partners: number;
};

export type TAvailbleStatus = 'active' | 'inactive';
export type TAvailbleTime = 'mins' | 'hours' | 'days';
