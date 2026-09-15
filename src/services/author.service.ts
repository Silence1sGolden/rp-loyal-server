import { db } from '@/db.js';
import { Author } from '@/models/stories.js';
import { RowDataPacket } from 'mysql2';

export async function getAuthorByUserID(
  user_id: number,
): Promise<Author | null> {
  const [authors] = await db.execute<(RowDataPacket & Author)[]>(
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
  user_ids: number[],
): Promise<Author[]> {
  const [authors] = await db.query<(RowDataPacket & Author)[]>(
    `
        SELECT profiles.user_id AS id,
               profiles.nickname,
               images.path AS avatar
        FROM profiles
        LEFT JOIN images ON images.id = profiles.avatar_id
        WHERE profiles.user_id IN (?)
        `,
    [user_ids],
  );

  return authors;
}
