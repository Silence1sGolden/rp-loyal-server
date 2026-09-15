import { RowDataPacket } from 'mysql2';

export type CharacterEditableParams = {
  first_name: string;
  second_name?: string;
  avatar_id?: string;
  gender?: string;
  age?: number;
  appearance?: string;
  history?: string;
};

export type Character = {
  id: string;
  author_id: number;
} & CharacterEditableParams;

export type ShortCharacter = {
  id: string;
  avatar?: string;
  first_name: string;
  second_name?: string;
};

export type CharacterRow = Character & RowDataPacket;
