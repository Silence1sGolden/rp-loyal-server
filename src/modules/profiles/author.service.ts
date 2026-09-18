import { Author } from '@/models/schemas/stories.js';
import { Db } from '@/utils/service.js';
import { RowDataPacket } from 'mysql2';

export async function getAuthorByUserID(
  conn: Db,
  user_id: number,
): Promise<Author | null> {
  const [authors] = await conn.execute<(RowDataPacket & Author)[]>(
    `
        SELECT profiles.user_id AS id,
               profiles.nickname,
               images.path AS avatar
        FROM profiles
        LEFT JOIN images ON images.id = profiles.avatar_id
        WHERE profiles.user_id = ?
        `,
    [user_id],
  );

  if (authors.length) {
    return authors[0];
  }

  return null;
}

export async function getAuthorsByUserIDs(
  conn: Db,
  user_ids: number[],
): Promise<Author[]> {
  const placeholder = Array.from({ length: user_ids.length })
    .map(() => '?')
    .join(', ');
  const [authors] = await conn.query<(RowDataPacket & Author)[]>(
    `
        SELECT profiles.user_id AS id,
               profiles.nickname,
               images.path AS avatar
        FROM profiles
        LEFT JOIN images ON images.id = profiles.avatar_id
        WHERE profiles.user_id IN (${placeholder})
        `,
    user_ids,
  );

  return authors;
}
