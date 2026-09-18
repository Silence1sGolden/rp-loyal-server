import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { Db } from '@/utils/service.js';
import { PasswordsSchema } from '@/models/schemas/users.js';

export async function GetPasswordByUserID(
  conn: Db,
  user_id: number,
): Promise<string | null> {
  const [passwords] = await conn.execute<
    (Omit<PasswordsSchema, 'user_id'> & RowDataPacket)[]
  >(
    `
        SELECT pass_hash
        FROM passwords
        WHERE user_id = ?
        `,
    [user_id],
  );

  if (passwords.length > 0) {
    return passwords[0].pass_hash;
  }

  return null;
}

export async function CreatePassword(
  conn: Db,
  user_id: number,
  password: string,
): Promise<boolean> {
  const pass_hash = await bcrypt.hash(password, 5);

  const [result] = await conn.execute<ResultSetHeader>(
    `
        INSERT INTO passwords (user_id, pass_hash)
        VALUES (?, ?)
        `,
    [user_id, pass_hash],
  );

  return result.affectedRows > 0;
}
