import { Tag } from './tags.js';

export type Playstyles = 'one-line' | 'semi-para' | 'para+' | 'novella';
export type Playtypes = '1v1' | 'group';

export type ShortStory = {
  id: number;
  title: string;
  preview: string | null;
};

export type Author = {
  id: number;
  nickname: string;
  avatar: string | null;
};

export type Story = {
  id: number;
  author: Author;
  title: string;
  description: string | null;
  preview: string | null;
  play_type: Playtypes;
  play_style: Playstyles[];
  tags: Tag[];
  updated_at: string;
  created_at: string;
};

export type StoriesSchema = {
  id: number;
  author_id: number;
  title: string;
  description: string | null;
  preview_id: number | null;
  play_type: Playtypes;
  updated_at: string;
  created_at: string;
};

export type StoriesPlayStylesSchema = {
  story_id: number;
  play_style: Playstyles;
};

export type StoriesTagsSchema = {
  story_id: number;
  tag_slug: string;
};

export type StoriesApplicationsSchema = {
  id: string;
  story_id: number;
  character_id: number;
  author_id: number;
  covering_letter: string | null;
  created_at: string;
};
