export type TUser = {
  _id: string;
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
  _id: string;
  title: string;
  author: string;
  tags: string[];
  about: string;
  rolesImage: string;
};

export type TRoles = {
  _id: string;
  title: string;
  messages: TMessage[];
  discussion: TMessage[];
  rolesImage: string;
};

export type TMessage = {
  _id: string;
  name: string;
  message: string;
  sendAt: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TRegister = {
  email: string;
  username: string;
  password: string;
};
