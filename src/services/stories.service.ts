import { db } from '@/db.js';
import { Stories, Story } from '@/models/stories.js';
import { RowDataPacket } from 'mysql2';
import { getStoriesTags, getStoryTags } from './stories-tags.service.js';
import {
  getStoriesPlaystyle,
  getStoryPlaystyle,
} from './stories-playstyles.service.js';
import { getImageByID, getImagesByIDs } from './images.service.js';
import { getAuthorByUserID, getAuthorsByUserIDs } from './author.service.js';
import {
  DEFAULT_LIMIT,
  sanitizeLimit,
  sanitizeOffset,
} from '@/utils/service.js';

export async function getStories(
  limit: number = DEFAULT_LIMIT,
  offset: number = 0,
): Promise<Story[]> {
  const safeLimit = sanitizeLimit(limit);
  const safeOffset = sanitizeOffset(offset);
  const [stories] = await db.query<(RowDataPacket & Stories)[]>(
    `
        SELECT id,
               title,
               description,
               preview_id,
               play_type,
               author_id,
               updated_at,
               created_at
        FROM stories
        LIMIT ${safeLimit}
        OFFSET ${safeOffset}
        `,
  );

  if (!stories.length) {
    return [];
  }

  const storiesIDs = stories.map((s) => s.id);
  const authorsIDs = new Set(stories.map((s) => s.author_id));
  const previewsIDS = stories
    .map((p) => p.preview_id)
    .filter((i) => i !== null);

  const tags = await getStoriesTags(storiesIDs);
  const play_styles = await getStoriesPlaystyle(storiesIDs);
  const previews = await getImagesByIDs(previewsIDS);
  const authors = await getAuthorsByUserIDs(Array.from(authorsIDs));

  const tagsByStory = Object.fromEntries(
    tags.map((tag) => [tag.story_id, tag.tags]),
  );
  const stylesByStory = Object.fromEntries(
    play_styles.map((st) => [st.story_id, st.play_style]),
  );
  const pathByPreviewID = Object.fromEntries(
    previews.map((preview) => [preview.id, preview.path]),
  );
  const authorsByID = Object.fromEntries(
    authors.map((author) => [author.id, author]),
  );

  return stories.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    play_type: i.play_type,
    author: authorsByID[i.author_id],
    tags: tagsByStory[i.id] ?? [],
    play_style: stylesByStory[i.id] ?? [],
    preview: i.preview_id ? pathByPreviewID[i.preview_id] : null,
  }));
}

export async function getStoriesByUserID(user_id: number): Promise<Story[]> {
  const [stories] = await db.query<(RowDataPacket & Stories)[]>(
    `
        SELECT id,
               title,
               description,
               preview_id,
               play_type,
               author_id,
               updated_at,
               created_at
        FROM stories
        WHERE author_id = ?
        `,
    [user_id],
  );

  if (!stories.length) {
    return [];
  }

  const storiesIDs = stories.map((s) => s.id);
  const previewsIDS = stories
    .map((p) => p.preview_id)
    .filter((i) => i !== null);

  const tags = await getStoriesTags(storiesIDs);
  const play_styles = await getStoriesPlaystyle(storiesIDs);
  const previews = await getImagesByIDs(previewsIDS);
  const author = await getAuthorByUserID(user_id);

  if (!author) {
    throw new Error('Author is not defined');
  }

  const tagsByStory = Object.fromEntries(
    tags.map((tag) => [tag.story_id, tag.tags]),
  );
  const stylesByStory = Object.fromEntries(
    play_styles.map((st) => [st.story_id, st.play_style]),
  );
  const pathByPreviewID = Object.fromEntries(
    previews.map((preview) => [preview.id, preview.path]),
  );

  console.log(previewsIDS, previews, pathByPreviewID);

  return stories.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    play_type: i.play_type,
    author: author,
    tags: tagsByStory[i.id] ?? [],
    play_style: stylesByStory[i.id] ?? [],
    preview: i.preview_id ? pathByPreviewID[i.preview_id] : null,
  }));
}

export async function getStoryByID(story_id: number): Promise<Story | null> {
  const [stories] = await db.query<(RowDataPacket & Stories)[]>(
    `
        SELECT id,
               title,
               description,
               preview_id,
               play_type,
               author_id,
               updated_at,
               created_at
        FROM stories
        WHERE id = ?
        `,
    [story_id],
  );

  if (!stories.length) {
    return null;
  }

  const target = stories[0];

  const tags = await getStoryTags(story_id);
  const play_styles = await getStoryPlaystyle(story_id);
  const preview = target.preview_id
    ? await getImageByID(target.preview_id)
    : null;
  const author = await getAuthorByUserID(target.author_id);

  if (!author) {
    throw new Error('Author is not defined');
  }

  return {
    id: target.id,
    title: target.title,
    description: target.description,
    play_type: target.play_type,
    author: author,
    tags: tags,
    play_style: play_styles,
    preview: preview?.path || null,
  };
}
