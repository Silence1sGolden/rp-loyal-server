import { Config, JsonDB } from 'node-json-db';
import { TProfile } from './types';
import { UUID } from 'crypto';

const usersDB = new JsonDB(new Config('./src/db/users/db', true, false, '/'));

export const getUsers = async (): Promise<TProfile[]> => {
  return await usersDB.getData('/users');
};

export const setUsers = async (users: TProfile[]): Promise<void> => {
  return await usersDB.push('/users', users);
};

export const getUserByID = async (id: UUID): Promise<TProfile | undefined> => {
  return await getUsers().then((users) => {
    return users.find((item) => item._id === id);
  });
};

export const createUser = async (user: TProfile): Promise<void> => {
  return await getUsers().then(async (users) => {
    if (Boolean(...users)) {
      return await setUsers([...users, user]);
    } else {
      return await setUsers([user]);
    }
  });
};

export const deleteUser = async (id: UUID): Promise<void> => {
  return await getUsers().then(async (users) => {
    return await setUsers(users.filter((item) => item._id !== id));
  });
};
