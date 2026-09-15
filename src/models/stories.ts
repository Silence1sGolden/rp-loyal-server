import { Character } from './characters.js';
import { Tag } from './tags.js';

export type Playstyles = 'one-line' | 'semi-para' | 'para+' | 'novella';
export type Playtypes = '1v1' | 'Group';

export type EditableStoryParams = {
  title: string;
  description: string | null;
  preview: string | null;
  tags: Tag[];
  play_type: Playtypes;
  play_style: Playstyles[];
};

export type ShortStory = {
  id: number;
  title: string;
  preview: string;
  author: Author;
};

export type Story = {
  id: number;
  author: Author;
} & EditableStoryParams;

export type Stories = {
  id: number;
  author_id: number;
  title: string;
  description: string | null;
  preview_id: number | null;
  play_type: Playtypes;
  updated_at: string;
  created_at: string;
};

export type Author = {
  id: number;
  nickname: string;
  avatar: string | null;
};

export type StoriesFilter = {
  tags: Tag[];
  play_styles: Playstyles[];
  play_types: Playtypes[];
};

export type StoryRequestForm = {
  id: string;
  author: Author;
  character: Character;
  covering_letter?: string;
};
