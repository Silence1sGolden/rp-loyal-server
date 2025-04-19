import * as bcrypt from 'bcrypt';
import { Config, JsonDB } from 'node-json-db';
import { TPassword } from './types';

const passwordsDB = new JsonDB(
  new Config('./src/db/passwords/db', true, false, '/'),
);

export const getPasswords = async (): Promise<TPassword> => {
  return await passwordsDB.getData('/passwords');
};
export const setPasswords = async (passwords: TPassword): Promise<void> => {
  return await passwordsDB.push('/passwords', passwords);
};
export const getPasswordByEmail = async (
  email: string,
): Promise<string | undefined> => {
  return await getPasswords().then((passwords) => {
    return passwords[email];
  });
};
export const createPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  return await getPasswords().then(async (passwords) => {
    return await bcrypt
      .hash(password, Math.round(Math.random() * (20 - 5) + 5))
      .then(async (hash: string) => {
        passwords[email] = hash;
        return await setPasswords(passwords);
      });
  });
};
export const deletePassword = async (email: string): Promise<void> => {
  return await getPasswords().then(async (passwords) => {
    delete passwords[email];
    return await setPasswords(passwords);
  });
};
