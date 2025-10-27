import { Config, JsonDB } from 'node-json-db';
import { randomUUID, UUID } from 'crypto';
import { IRoomUser, TMessage, TRoom } from '@/models/data';
import path from 'path';

const roomsDB = new JsonDB(
  new Config(path.join(__dirname, 'auth.db.json'), true, false, '/'),
);

const getRooms = async (): Promise<Record<number, TRoom> | undefined> => {
  return await roomsDB.getData('/rooms');
};

const setRoomByID = async (roomID: UUID, roomData: TRoom): Promise<void> => {
  await roomsDB.push(`/rooms/${roomID}`, roomData);
};

export const getRoomByID = async (roomID: UUID): Promise<TRoom | undefined> => {
  return await roomsDB.getData(`/${roomID}`);
};

export const getRoomsByUserID = async (
  userID: number,
): Promise<UUID[] | undefined> => {
  const rooms = await getRooms();
  if (rooms) {
    const userRooms: UUID[] = [];
    for (const roomID in rooms) {
      if (rooms[roomID].users.find((item) => item.userID === userID)) {
        userRooms.push(rooms[roomID].rolesID);
      }
    }
    return userRooms;
  }
};

export const createRoom = async (
  rolesID: UUID,
  users: IRoomUser[],
): Promise<void> => {
  const roomID = randomUUID();
  const date = Date.now();
  roomsDB.push(`/rooms/${roomID}`, {
    rolesID: rolesID,
    users: users,
    createdAt: date,
    messages: [],
  });
};

export const writeMessage = async (
  roomID: UUID,
  message: TMessage,
): Promise<void> => {
  const room = await getRoomByID(roomID);
  if (room) {
    room.messages.push(message);
    await setRoomByID(roomID, room);
  }
};

export const deleteRoomByID = async (roomID: UUID): Promise<void> => {
  await roomsDB.delete(`/rooms/${roomID}`);
};

export const getMessages = async (
  roomID: UUID,
  options?: {
    from: number;
    to: number;
  },
): Promise<TMessage[] | undefined> => {
  const room = await getRoomByID(roomID);

  if (room) {
    if (options) {
      return room.messages.slice(options.from, options.to);
    }
    return room.messages;
  }
};
