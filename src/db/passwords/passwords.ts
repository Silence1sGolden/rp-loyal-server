import * as bcrypt from 'bcrypt';
import { Config, JsonDB } from 'node-json-db';

const passwordsDB = new JsonDB(
  new Config('./src/db/passwords/db', true, false, '/'),
);

export const createPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  return await getPasswords().then(
    async (passwords: Record<string, string>) => {
      return await bcrypt
        .hash(password, Math.round(Math.random() * (20 - 5) + 5))
        .then(async (hash: string) => {
          passwords[email] = hash;
          return await passwordsDB.push('/passwords', passwords);
        });
    },
  );
};
export const getPasswords = async (): Promise<Record<string, string>> => {
  return await passwordsDB.getData('/passwords');
};
export const setPasswords = async (
  passwords: Record<string, string>,
): Promise<void> => {
  return await passwordsDB.push('/passwords', passwords);
};
export const deletePassword = async (email: string): Promise<void> => {
  return await getPasswords().then(async (passwords) => {
    delete passwords[email];
    return await setPasswords(passwords);
  });
};
