import { db } from '@/db.js';
import { TCodeRow } from '@/models/mail/types.js';
import { getRandomCode } from '@/utils/service.js';
import { ResultSetHeader } from 'mysql2';

export async function CreateCode(user_id: number): Promise<string | null> {
  const code = getRandomCode();

  const [result] = await db.execute<ResultSetHeader>(
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

export async function CheckCode(
  user_id: number,
  code: string,
): Promise<boolean> {
  const [codes] = await db.execute<TCodeRow[]>(
    `
        SELECT *
        FROM codes
        WHERE user_id = ? AND expires_at > NOW()
        `,
    [user_id, code],
  );

  if (codes.length > 0) {
    await db.execute<TCodeRow[]>(
      `
        DELETE
        FROM codes
        WHERE user_id = ?
        `,
      [user_id],
    );

    return codes[0].code === code;
  }

  return false;
}
