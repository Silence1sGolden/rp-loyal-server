import { RowDataPacket } from 'mysql2';

export type RoomRow = RowDataPacket & Room;
export type Room = {
  id: number;
  avatar: string;
  title: string;
  unread_count: number;
  last_message_time: string;
  last_message_text: string;
};

export type RoomMessage = {
  id: number;
};
