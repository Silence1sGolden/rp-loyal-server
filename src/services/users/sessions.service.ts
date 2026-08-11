import { db } from '@/db.js';
import { TSession, TSessionRow } from '@/models/users/types.js';
import { ResultSetHeader } from 'mysql2';

export async function GetSessionsByUserID(
  user_id: number,
): Promise<TSession[] | null> {
  const [sessions] = await db.query<TSessionRow[]>(
    `
        SELECT *
        FROM sessions
        WHERE user_id = ? AND expires_at > NOW()
        `,
    [user_id],
  );

  if (sessions.length > 0) {
    return sessions;
  }

  return null;
}

export async function GetSessionByID(
  session_id: number,
): Promise<TSession | null> {
  const [sessions] = await db.query<TSessionRow[]>(
    `
        SELECT *
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

export async function UpdateSessionByID(session_id: number): Promise<boolean> {
  const [result] = await db.query<ResultSetHeader>(
    `
        UPDATE sessions
        SET expires_at = NOW() + INTERVAL 7 DAY
        WHERE id = ?
        `,
    [session_id],
  );

  return result.affectedRows > 0;
}

export async function CreateSession(user_id: number): Promise<number | null> {
  const [result] = await db.query<ResultSetHeader>(
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
