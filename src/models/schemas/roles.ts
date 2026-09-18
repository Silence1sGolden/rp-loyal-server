export type RolesSchema = {
  id: number;
  author_id: number;
  title: string;
  about: string;
  avatar: string | null;
};

export type RolesRequestSchema = {
  roles_id: number;
  character_id: number;
  cover_letter: string | null;
};
