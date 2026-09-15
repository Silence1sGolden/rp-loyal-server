import { db } from '@/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export type Profile = {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string | null;
  about: string | null;
  created_at: string;
};

export async function getProfilesByUserIDs(
  user_id: number[],
): Promise<Profile[]> {
  const [profiles] = await db.execute<(RowDataPacket & Profile)[]>(
    `
        SELECT users.id,
               users.username,
               users.email,
               profiles.nickname,
               profiles.about,
               users.created_at,
               images.path AS avatar
        FROM profiles
        LEFT JOIN users ON users.id = profiles.user_id
        LEFT JOIN images ON images.id = profiles.avatar_id
        WHERE profiles.user_id IN (?)
        `,
    [user_id],
  );

  return profiles;
}

export async function getProfileByUserID(
  user_id: number,
): Promise<Profile | null> {
  const [profiles] = await db.execute<(RowDataPacket & Profile)[]>(
    `
        SELECT users.id,
               users.username,
               users.email,
               profiles.nickname,
               profiles.about,
               users.created_at,
               images.path AS avatar
        FROM profiles
        LEFT JOIN users ON users.id = profiles.user_id
        LEFT JOIN images ON images.id = profiles.avatar_id
        WHERE profiles.user_id = ?
        `,
    [user_id],
  );

  if (profiles.length > 0) {
    return profiles[0];
  }

  return null;
}

export async function createProfile(
  user_id: number,
  username: string,
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `
        INSERT INTO profiles (user_id, nickname)
        VALUES (?, ?)
        `,
    [user_id, username],
  );

  return result.affectedRows > 0;
}
