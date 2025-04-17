import { TUser } from '@/utils/types';
import { Config, JsonDB } from 'node-json-db';

const usersDB = new JsonDB(new Config('./src/db/users/db', true, false, '/'));

export const getUsers = async (): Promise<TUser[]> => {
  return await usersDB.getData('/users');
};

export const setUsers = async (users: TUser[]): Promise<void> => {
  return await usersDB.push('/users', users);
};

export const getUserByID = async (id: string): Promise<TUser | undefined> => {
  return await usersDB.getData('/users').then((users: TUser[]) => {
    return users.find((item) => item._id === id);
  });
};

export const createUser = async (user: TUser): Promise<void> => {
  return await usersDB.getData('/users').then(async (users: TUser[]) => {
    return await usersDB.push('/users', [...users, user]);
  });
};

export const getNextUserID = async (): Promise<string> => {
  return await usersDB.getData('/users').then((users: TUser[]) => {
    return '0'.repeat(10 - (users.length + '').length) + (users.length + 1);
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  return await getUsers().then(async (users) => {
    return await setUsers(users.filter((item) => item._id !== id));
  });
};
