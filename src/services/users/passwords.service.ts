import { db } from '@/db.js';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';

export async function CreatePassword(
  user_id: number,
  password: string,
): Promise<boolean> {
  const pass_hash = await bcrypt.hash(password, 5);

  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO passwords (user_id, pass_hash)
        VALUES (?, ?)
        `,
    [user_id, pass_hash],
  );

  return result.affectedRows > 0;
}
