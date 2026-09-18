import { SessionsSchema } from '@/models/schemas/users.js';
import { Db } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GetSessionsByUserID(
  conn: Db,
  user_id: number,
): Promise<SessionsSchema[]> {
  const [sessions] = await conn.execute<(SessionsSchema & RowDataPacket)[]>(
    `
        SELECT id,
               user_id,
               expires_at
        FROM sessions
        WHERE user_id = ? AND expires_at > NOW()
        `,
    [user_id],
  );

  return sessions;
}

export async function GetSessionByID(
  conn: Db,
  session_id: number,
): Promise<SessionsSchema | null> {
  const [sessions] = await conn.execute<(SessionsSchema & RowDataPacket)[]>(
    `
        SELECT id,
               user_id,
               expires_at
        FROM sessions
        WHERE id = ? AND expires_at > NOW()
        `,
    [session_id],
  );

  if (sessions.length > 0) {
    return sessions[0];
  }

  return null;
}

export async function UpdateSessionByID(
  conn: Db,
  session_id: number,
): Promise<boolean> {
  const [result] = await conn.execute<ResultSetHeader>(
    `
        UPDATE sessions
        SET expires_at = NOW() + INTERVAL 7 DAY
        WHERE id = ?
        `,
    [session_id],
  );

  return result.affectedRows > 0;
}

export async function CreateSession(
  conn: Db,
  user_id: number,
): Promise<number | null> {
  const [result] = await conn.execute<ResultSetHeader>(
    `
        INSERT INTO sessions (user_id)
        VALUES (?)
        `,
    [user_id],
  );

  if (result.insertId) {
    return result.insertId;
  }

  return null;
}
