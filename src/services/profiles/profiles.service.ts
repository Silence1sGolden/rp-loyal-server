import { db } from '@/db.js';
import { TProfile, TProfileRow } from '@/models/profiles/types.js';

export async function getProfileByUserID(
  user_id: number,
): Promise<TProfile | null> {
  const [profiles] = await db.query<TProfileRow[]>(
    `
        SELECT *
        FROM profiles
        WHERE user_id = ?
        `,
    [user_id],
  );

  if (profiles.length > 0) {
    return profiles[0];
  }

  return null;
}
