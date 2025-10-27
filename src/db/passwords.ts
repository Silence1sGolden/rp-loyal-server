import * as bcrypt from 'bcrypt';
import { Config, JsonDB } from 'node-json-db';
import path from 'path';

const passwordsDB = new JsonDB(
  new Config(path.join(__dirname, 'auth.db.json'), true, false, '/'),
);

const setPassword = async (userID: number, password: string): Promise<void> => {
  await passwordsDB.push(`/passwords/${userID}`, password);
};

export const getPasswordByUserID = async (
  userID: number,
): Promise<string | undefined> => {
  return await passwordsDB.getData(`/passwords/${userID}`);
};

export const createPassword = async (
  userID: number,
  password: string,
): Promise<void> => {
  const hash = await bcrypt.hash(
    password,
    Math.round(Math.random() * (20 - 5) + 5),
  );
  await setPassword(userID, hash);
};

export const deletePasswordByUserID = async (userID: number): Promise<void> => {
  await passwordsDB.delete(`/passwords/${userID}`);
};
