import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { GetImageByID, GetImagesByIDs } from '../images/images.service.js';
import {
  getAuthorByUserID,
  getAuthorsByUserIDs,
} from '../profiles/author.service.js';
import { customParse, Db, DEFAULT_LIMIT, MAX_LIMIT } from '@/utils/service.js';
import {
  Playstyles,
  Playtypes,
  ShortStory,
  StoriesSchema,
  Story,
} from '@/models/schemas/stories.js';
import { TagsSchema } from '@/models/schemas/tags.js';

async function enrichStories(
  conn: Db,
  stories: StoriesSchema[],
): Promise<Story[]> {
  if (!stories.length) return [];

  const storiesIDs = stories.map((s) => s.id);
  const authorsIDs = new Set(stories.map((s) => s.author_id));
  const previewsIDS = stories
    .map((p) => p.preview_id)
    .filter((i): i is number => i !== null);

  const [tags, play_styles, previews, authors] = await Promise.all([
    GetStoriesTags(conn, storiesIDs),
    GetStoriesPlaystyle(conn, storiesIDs),
    previewsIDS.length
      ? GetImagesByIDs(conn, previewsIDS)
      : Promise.resolve([]),
    authorsIDs.size
      ? getAuthorsByUserIDs(conn, [...authorsIDs])
      : Promise.resolve([]),
  ]);

  const tagsByStory = Object.fromEntries(tags.map((t) => [t.story_id, t.tags]));
  const stylesByStory = Object.fromEntries(
    play_styles.map((s) => [s.story_id, s.play_style]),
  );
  const pathByPreviewID = Object.fromEntries(
    previews.map((p) => [p.id, p.path]),
  );
  const authorsByID = Object.fromEntries(authors.map((a) => [a.id, a]));

  return stories.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    play_type: i.play_type,
    author: authorsByID[i.author_id],
    tags: tagsByStory[i.id] ?? [],
    play_style: stylesByStory[i.id] ?? [],
    preview: i.preview_id ? (pathByPreviewID[i.preview_id] ?? null) : null,
    updated_at: i.updated_at,
    created_at: i.created_at,
  }));
}

export type StoryFilters = {
  author_id?: number;
  tag_slugs?: string[];
  play_styles?: Playstyles[];
  play_types?: Playtypes;
  search?: string;
  sort?: 'recent' | 'updated';
};

export async function GetStories(
  conn: Db,
  filters: StoryFilters,
  limit: number = DEFAULT_LIMIT,
  offset: number = 0,
): Promise<Story[]> {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), MAX_LIMIT);
  const safeOffset = Math.max(0, Math.floor(offset));

  const where: string[] = [];
  const params: any[] = [];

  if (filters.author_id !== undefined) {
    where.push('s.author_id = ?');
    params.push(filters.author_id);
  }

  if (filters.play_types) {
    where.push('s.play_type = ?');
    params.push(filters.play_types);
  }

  if (filters.tag_slugs?.length) {
    where.push(
      `s.id IN (
        SELECT story_id FROM story_tags
        WHERE tag_slug IN (${filters.tag_slugs.map(() => '?').join(',')})
      )`,
    );
    params.push(...filters.tag_slugs);
  }

  if (filters.play_styles?.length) {
    where.push(
      `s.id IN (
        SELECT story_id FROM story_play_styles
        WHERE play_style IN (${filters.play_styles.map(() => '?').join(',')})
      )`,
    );
    params.push(...filters.play_styles);
  }

  if (filters.search) {
    where.push('s.title LIKE ?');
    params.push(`%${filters.search}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const ORDER_BY: Record<NonNullable<StoryFilters['sort']>, string> = {
    recent: 's.created_at DESC',
    updated: 's.updated_at DESC',
  };
  const orderBy = ORDER_BY[filters.sort ?? 'recent'];

  const [stories] = await conn.execute<(RowDataPacket & StoriesSchema)[]>(
    `
      SELECT s.id,
             s.title,
             s.description,
             s.preview_id,
             s.play_type,
             s.author_id,
             s.updated_at,
             s.created_at
      FROM stories s
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
    params,
  );

  return await enrichStories(conn, stories);
}

export async function GetShortStoriesByAuthorID(
  conn: Db,
  author_id: number,
): Promise<ShortStory[]> {
  const [stories] = await conn.execute<(ShortStory & RowDataPacket)[]>(
    `
      SELECT stories.id,
             stories.title,
             images.path AS preview
      FROM stories
      LEFT JOIN images ON images.id = stories.preview_id
      WHERE stories.author_id = ?
    `,
    [author_id],
  );

  return stories;
}

export async function getStoryByID(
  conn: Db,
  story_id: number,
): Promise<Story | null> {
  const [stories] = await conn.query<(RowDataPacket & StoriesSchema)[]>(
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

  const tags = await GetStoryTags(conn, story_id);
  const play_styles = await GetStoryPlaystyle(conn, story_id);
  const preview = target.preview_id
    ? await GetImageByID(conn, target.preview_id)
    : null;
  const author = await getAuthorByUserID(conn, target.author_id);

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
    created_at: target.created_at,
    updated_at: target.updated_at,
  };
}

export async function DeleteStoryByID(
  conn: Db,
  story_id: number,
): Promise<boolean> {
  const [result] = await conn.query<ResultSetHeader>(
    `
        DELETE
        FROM stories
        WHERE id = ?
        `,
    [story_id],
  );

  return result.affectedRows > 0;
}

export async function CreateStory(
  conn: Db,
  author_id: number,
  story: Omit<StoriesSchema, 'author_id' | 'id' | 'updated_at' | 'created_at'>,
): Promise<number> {
  const { title, description, preview_id, play_type } = story;
  const [result] = await conn.execute<ResultSetHeader>(
    `
        INSERT INTO stories (author_id, title, description, preview_id, play_type)
        VALUES (?, ?, ?, ?, ?)
    `,
    [author_id, title, description, preview_id, play_type],
  );

  return result.insertId;
}

export async function CreateStoryPlaystyle(
  conn: Db,
  story_id: number,
  play_style: Playstyles[],
): Promise<void> {
  if (!play_style.length) {
    throw new Error('Failed to insert play_style: play_style length 0');
  }

  const flatPlaystyles = play_style.flatMap((ps) => [story_id, ps]);
  const placeholder = Array.from({ length: play_style.length })
    .map(() => '(?, ?)')
    .join(', ');

  await conn.execute<ResultSetHeader>(
    `
        INSERT INTO story_play_styles (story_id, play_style)
        VALUES ${placeholder}
    `,
    flatPlaystyles,
  );
}

export async function GetStoryPlaystyle(
  conn: Db,
  story_id: number,
): Promise<Playstyles[]> {
  const [play_styles] = await conn.execute<
    ({ play_styles: Playstyles[] } & RowDataPacket)[]
  >(
    `
        SELECT JSON_ARRAYAGG(play_style) AS play_styles
        FROM story_play_styles
        WHERE story_play_styles.story_id = ?
    `,
    [story_id],
  );

  return play_styles[0].play_styles;
}

export async function GetStoriesPlaystyle(
  conn: Db,
  story_ids: number[],
): Promise<{ story_id: number; play_style: Playstyles[] }[]> {
  const placeholder = Array.from({ length: story_ids.length })
    .map(() => '?')
    .join(', ');
  const [play_styles] = await conn.execute<
    ({ story_id: number; play_style: string } & RowDataPacket)[]
  >(
    `
        SELECT
            story_play_styles.story_id,
            JSON_ARRAYAGG(story_play_styles.play_style) AS play_style
        FROM story_play_styles
        WHERE story_play_styles.story_id IN (${placeholder})
        GROUP BY story_play_styles.story_id;
    `,
    story_ids,
  );

  return play_styles.map((t) => ({
    story_id: t.story_id,
    play_style: customParse(t.play_style),
  }));
}

export async function CreateStoryTags(
  conn: Db,
  story_id: number,
  slugs: string[],
): Promise<void> {
  if (!slugs.length) {
    return;
  }

  const flatTags = slugs.flatMap((slug) => [story_id, slug]);
  const placeholder = Array.from({ length: slugs.length })
    .map(() => '(?, ?)')
    .join(', ');

  await conn.execute<ResultSetHeader>(
    `
        INSERT INTO story_tags (story_id, tag_slug)
        VALUES ${placeholder}
    `,
    flatTags,
  );
}

export async function GetStoryTags(
  conn: Db,
  story_id: number,
): Promise<Omit<TagsSchema, 'created_at' | 'name_ru'>[]> {
  const [tags] = await conn.execute<
    (Omit<TagsSchema, 'created_at' | 'name_ru'> & RowDataPacket)[]
  >(
    `
      SELECT tags.slug,
             tags.name_en
      FROM story_tags
      JOIN tags ON tags.slug = story_tags.tag_slug
      WHERE story_tags.story_id = ?
    `,
    [story_id],
  );

  return tags;
}

export async function GetStoriesTags(
  conn: Db,
  story_ids: number[],
): Promise<
  { story_id: number; tags: Omit<TagsSchema, 'created_at' | 'name_ru'>[] }[]
> {
  const placeholder = Array.from({ length: story_ids.length })
    .map(() => '?')
    .join(', ');
  const [tags] = await conn.execute<
    ({ story_id: number; tags: string } & RowDataPacket)[]
  >(
    `
        SELECT
            st.story_id,
            JSON_ARRAYAGG(JSON_OBJECT('slug', t.slug, 'name_en', t.name_en)) AS tags
        FROM story_tags st
        JOIN tags t ON t.slug = st.tag_slug
        WHERE st.story_id IN (${placeholder})
        GROUP BY st.story_id;
    `,
    story_ids,
  );

  return tags.map((t) => ({
    story_id: t.story_id,
    tags: customParse(t.tags),
  }));
}
