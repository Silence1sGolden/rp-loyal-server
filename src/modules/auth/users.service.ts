import { UsersSchema } from '@/models/schemas/users.js';
import { Db } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GetUserByEmail(
  conn: Db,
  email: string,
): Promise<UsersSchema | null> {
  const [users] = await conn.execute<(UsersSchema & RowDataPacket)[]>(
    `
      SELECT id, 
             username,
             email,
             is_activated,
             created_at
      FROM users
      WHERE email = ?
    `,
    [email],
  );

  if (users.length > 0) {
    return users[0];
  }

  return null;
}

export async function GetUserByID(
  conn: Db,
  user_id: number,
): Promise<UsersSchema | null> {
  const [users] = await conn.execute<(UsersSchema & RowDataPacket)[]>(
    `
      SELECT id, 
             username,
             email,
             is_activated,
             created_at
      FROM users
      WHERE users.id = ?
    `,
    [user_id],
  );

  if (users.length > 0) {
    return users[0];
  }

  return null;
}

export async function CreateUser(
  conn: Db,
  username: string,
  email: string,
): Promise<number> {
  const [result] = await conn.execute<ResultSetHeader>(
    `
      INSERT INTO users (username, email)
      VALUES (?, ?)
    `,
    [username, email],
  );

  return result.insertId;
}

export async function VerifyUser(conn: Db, user_id: number): Promise<boolean> {
  const [result] = await conn.execute<ResultSetHeader>(
    `
      UPDATE users
      SET is_activated = true
      WHERE id = ? AND is_activated = false
    `,
    [user_id],
  );

  return result.affectedRows > 0;
}
