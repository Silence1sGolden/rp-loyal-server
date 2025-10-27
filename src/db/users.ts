import { Config, JsonDB } from 'node-json-db';
import { IUser } from '../models/types';
import path from 'path';

const usersDB = new JsonDB(
  new Config(path.join(__dirname, 'db.json'), true, false, '/'),
);

const getUsers = async (): Promise<IUser[]> => {
  return await usersDB.getData('/users');
};

const setUsers = async (users: IUser[]): Promise<void> => {
  await usersDB.push('/users', users);
};

const getCount = async (): Promise<number> => {
  return await usersDB.getData('/count');
};

const incraseCount = async (): Promise<void> => {
  const count = await getCount();
  await usersDB.push('/count', count + 1);
};

export const createUser = async (
  email: string,
  username: string,
): Promise<IUser | undefined> => {
  const users = await getUsers();
  if (users) {
    const id = await getCount();
    const newUser = { id, email, username } as IUser;
    await setUsers([...users, newUser]);
    await incraseCount();
    return newUser;
  }
};

export const getUserByID = async (id: number): Promise<IUser | undefined> => {
  return await getUsers().then(async (users) => {
    return users.find((user) => user.id === id);
  });
};

export const getUserByEmail = async (
  email: string,
): Promise<IUser | undefined> => {
  return await getUsers().then(async (users) => {
    return users.find((user) => user.email === email);
  });
};

export const deleteUserByID = async (id: number): Promise<void> => {
  await getUsers().then(async (users) => {
    await setUsers(users.filter((user) => user.id !== id));
  });
};

export const deleteUserByEmail = async (email: string): Promise<void> => {
  await getUsers().then(async (users) => {
    await setUsers(users.filter((user) => user.email !== email));
  });
};
