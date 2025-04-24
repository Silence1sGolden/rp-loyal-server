import { Config, JsonDB } from 'node-json-db';
import { TMessage, TRooms } from './types';
import { UUID } from 'crypto';

const roomsDB = new JsonDB(new Config('./src/db/rooms/db', true, false, '/'));

export const getRooms = async (): Promise<TRooms[]> => {
  return await roomsDB.getData('/rooms');
};

export const setRooms = async (rooms: TRooms[]): Promise<void> => {
  return await roomsDB.push('/rooms', rooms);
};

export const createRooms = async (role: TRooms): Promise<void> => {
  return await getRooms().then(async (rooms) => {
    return await setRooms([...rooms, role]);
  });
};

export const getRoomsByID = async (id: UUID): Promise<TRooms | undefined> => {
  return await getRooms().then((rooms) =>
    rooms.find((role) => role._id === id),
  );
};

export const writeMessage = async (
  id: UUID,
  message: TMessage,
): Promise<void> => {
  return await getRooms().then(async (rooms) => {
    const role = await getRoomsByID(id);

    if (role) {
      const newRooms = rooms.filter((item) => item._id !== id);
      role.messages.push(message);
      return await setRooms([...newRooms, role]);
    }
  });
};

export const deleteRooms = async (id: UUID): Promise<void> => {
  return await getRooms().then(async (rooms) => {
    await setRooms([...rooms.filter((role) => role._id !== id)]);
  });
};

export const updateRooms = async (id: UUID, data: TRooms): Promise<void> => {
  return await getRooms().then(async (rooms) => {
    const role = await getRoomsByID(id);

    if (role) {
      const newRooms = rooms.filter((item) => item._id !== id);
      role.roomsIMG = data.roomsIMG;
      role.title = data.title;
      role.description = data.description;
      role.tags = data.tags;
      return await setRooms([...newRooms, role]);
    }
  });
};
