import { db } from '@/db.js';
import { Tag, TagRow } from '@/models/tags.js';

export async function getTags(search?: string): Promise<Tag[]> {
  const trimmed = search?.trim() ?? '';

  const sql = `
    SELECT slug, name_en
    FROM tags
    ${trimmed ? 'WHERE name_en LIKE ?' : ''}
    ORDER BY name_en ASC
    LIMIT 50
  `;

  const params = trimmed ? [trimmed] : [];

  const [rows] = await db.execute<TagRow[]>(sql, params);

  return rows;
}
