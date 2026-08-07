import { db } from '@/db';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';

export async function CreatePassword(
  user_id: number,
  password: string,
): Promise<number | null> {
  const pass_hash = bcrypt.hash(password, 5);

  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO passwords (user_id, pass_hash)
        VALUES (?, ?)
        `,
    [user_id, pass_hash],
  );

  if (result.affectedRows) {
    return result.insertId;
  }

  return null;
}
