export type CharactersSchema = {
  id: number;
  author_id: number;
  avatar_id: number | null;
  first_name: string;
  second_name: string | null;
  gender: string | null;
  age: number | null;
  appearance: string | null;
  history: string | null;
};

export type ShortCharacter = {
  id: string;
  avatar?: string;
  first_name: string;
  second_name?: string;
};
