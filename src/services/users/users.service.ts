import { db } from '@/db.js';
import { TUser, TUserRow } from '../../models/users/types.js';
import { ResultSetHeader } from 'mysql2';

export async function GetUserByEmail(email: string): Promise<TUser | null> {
  const [users] = await db.query<TUserRow[]>(
    `
        SELECT users.id as user_id, 
               users.username as username,
               users.email as email,
               users.is_activated as is_activated,
               passwords.pass_hash as pass_hash
        FROM users
        JOIN passwords ON users.id = passwords.user_id
        WHERE users.email = ?
        `,
    [email],
  );

  return users.length > 0 ? users[0] : null;
}

export async function GetUserByID(user_id: number): Promise<TUser | null> {
  const [users] = await db.query<TUserRow[]>(
    `
        SELECT users.id as user_id, 
               users.username as username,
               users.email as email,
               users.is_activated as is_activated,
               passwords.pass_hash as pass_hash
        FROM users
        JOIN passwords ON users.id = passwords.user_id
        WHERE users.id = ?
        `,
    [user_id],
  );

  return users.length > 0 ? users[0] : null;
}

export async function CreateUser(
  username: string,
  email: string,
): Promise<number | null> {
  const [result] = await db.query<ResultSetHeader>(
    `
        INSERT INTO users (username, email)
        VALUES (?, ?)
        `,
    [username, email],
  );

  if (result.affectedRows) {
    return result.insertId;
  }

  return null;
}

export async function VarifyUser(user_id: number): Promise<boolean> {
  const [result] = await db.query<ResultSetHeader>(
    `
        UPDATE users
        SET is_activated = true
        WHERE id = ?
        `,
    [user_id],
  );

  return result.affectedRows > 0;
}
