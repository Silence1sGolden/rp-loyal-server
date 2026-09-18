import { Db, getRandomCode } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function CreateCode(
  conn: Db,
  user_id: number,
): Promise<string | null> {
  const code = getRandomCode();

  const [result] = await conn.execute<ResultSetHeader>(
    `
      INSERT INTO codes (user_id, code)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        code = VALUES(code)
    `,
    [user_id, code],
  );

  return result.affectedRows > 0 ? code : null;
}

export async function CheckOnHasCode(
  conn: Db,
  user_id: number,
  code: string,
): Promise<boolean> {
  const [codes] = await conn.execute<
    ({ exists_code: number } & RowDataPacket)[]
  >(
    `
      SELECT EXISTS (
        SELECT 1
        FROM codes
        WHERE user_id = ? AND code = ? AND expires_at > NOW()
      ) AS exists_code
    `,
    [user_id, code],
  );

  if (codes.length > 0) {
    return Boolean(codes[0].exists_code);
  }

  return false;
}

export async function DeleteCode(
  conn: Db,
  user_id: number,
  code: string,
): Promise<void> {
  await conn.execute<ResultSetHeader[]>(
    `
      DELETE
      FROM codes
      WHERE user_id = ? AND code = ?
    `,
    [user_id, code],
  );
}
