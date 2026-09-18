export type RoomsSchema = {
  id: number;
  title: string;
  description: string | null;
  avatar: string | null;
  is_archive: boolean;
};

export type RoomCharactersSchema = {
  room_id: number;
  character_id: number;
};

export type RoomUsersSchema = {
  user_id: number;
  room_id: number;
  last_seen: string;
};

export type RoomMessagesSchema = {
  id: number;
  room_id: number;
  character_id: string;
  action_type: 'action' | 'dialogue' | 'thought' | 'event';
  message_text: string;
  created_at: string;
};
