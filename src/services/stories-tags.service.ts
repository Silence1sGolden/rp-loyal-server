import { db } from '@/db.js';
import { Tag } from '@/models/tags.js';
import { customParse } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createStoryTags(
  story_id: number,
  tags: Tag[],
): Promise<number> {
  const flatTags = tags.flatMap((i) => [story_id, i.slug]);
  const placeholder = Array.from({ length: tags.length })
    .map(() => '(?, ?)')
    .join(', ');
  const [result] = await db.execute<ResultSetHeader>(
    `
        INSERT INTO story_tags (story_id, slug)
        VALUES ${placeholder}
    `,
    [flatTags],
  );

  return result.affectedRows;
}

export async function getStoryTags(story_id: number): Promise<Tag[]> {
  const [tags] = await db.execute<(Tag & RowDataPacket)[]>(
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

export async function getStoriesTags(
  story_id: number[],
): Promise<{ story_id: number; tags: Tag[] }[]> {
  const [tags] = await db.execute<
    ({ story_id: number; tags: string } & RowDataPacket)[]
  >(
    `
        SELECT
            st.story_id,
            JSON_ARRAYAGG(JSON_OBJECT('slug', t.slug, 'name_en', t.name_en)) AS tags
        FROM story_tags st
        JOIN tags t ON t.slug = st.tag_slug
        WHERE st.story_id IN (?)
        GROUP BY st.story_id;
    `,
    [story_id],
  );

  return tags.map((t) => ({
    story_id: t.story_id,
    tags: customParse(t.tags),
  }));
}
