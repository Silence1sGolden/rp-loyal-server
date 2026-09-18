import { db } from '@/db.js';
import { RoomsSchema } from '@/models/schemas/rooms.js';
import { ExecuteValues, RowDataPacket } from 'mysql2';

export async function getRoomsByID(user_id: number): Promise<RoomsSchema[]> {
  const [rooms] = await db.execute<(RoomsSchema & RowDataPacket)[]>(
    `
        SELECT rooms.id, rooms.title, rooms.avatar,
              ( SELECT COUNT(*)
                FROM room_messages
                WHERE room_id = rooms.id
                  AND created_at > COALESCE(room_users.last_seen, '1970-01-01')
              ) AS unread_count,
              latest.message_text as last_message_text,
              latest.created_at as last_message_time
        FROM room_users
        JOIN rooms ON room_users.room_id = rooms.id
        LEFT JOIN LATERAL (
            SELECT message_text, created_at
            FROM room_messages
            WHERE room_id = rooms.id
            ORDER BY id DESC
            LIMIT 1
        ) latest ON TRUE
        WHERE room_users.user_id = ?
        LIMIT 20;
        `,
    [user_id],
  );

  return rooms;
}

type getMessagesByRoomIDOptions = {
  message_id?: number;
  limit?: number;
  before_time: string;
  after_time: string;
};

export async function getMessagesByRoomID(
  room_id: number,
  options?: getMessagesByRoomIDOptions,
): Promise<RoomsSchema[]> {
  const opt = {
    message_id: null,
    limit: 20,
    before_time: null,
    after_timeL: null,
    ...options,
  };

  let request = `
        SELECT id,
               message_text as message,
               character_id,
               action_type,
               created_at
        FROM room_messages
        WHERE room_id = ?
        `;
  const params: ExecuteValues[] = [room_id];

  if (opt.message_id) {
    request += ' AND id < ?';
    params.push(opt.message_id);
  }

  if (opt.before_time) {
    request += ' AND created_at < ?';
    params.push(opt.before_time);
  }

  if (opt.after_time) {
    request += ' AND created_at > ?';
    params.push(opt.after_time);
  }

  request += ' ORDER BY id DESC LIMIT ?';
  params.push(opt.limit);
  const [messages] = await db.execute<(RoomsSchema & RowDataPacket)[]>(
    request,
    params,
  );

  return messages;
}
