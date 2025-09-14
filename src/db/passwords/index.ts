import * as bcrypt from 'bcrypt';
import { Config, JsonDB } from 'node-json-db';
import { TPassword } from './types';
import { UUID } from 'crypto';

const passwordsDB = new JsonDB(
  new Config('./src/db/passwords/db', true, false, '/'),
);

const getPasswords = async (): Promise<TPassword> => {
  return await passwordsDB.getData('/passwords');
};

const setPasswords = async (passwords: TPassword): Promise<void> => {
  await passwordsDB.push('/passwords', passwords);
};

export const getPasswordByID = async (
  id: UUID,
): Promise<string | undefined> => {
  return await getPasswords().then((passwords) => {
    return passwords[id];
  });
};

export const createPassword = async (
  id: UUID,
  password: string,
): Promise<void> => {
  await getPasswords().then(async (passwords) => {
    await bcrypt
      .hash(password, Math.round(Math.random() * (20 - 5) + 5))
      .then(async (hash: string) => {
        passwords[id] = hash;
        await setPasswords(passwords);
      });
  });
};

export const deletePassword = async (id: UUID): Promise<void> => {
  await getPasswords().then(async (passwords) => {
    // eslint-disable-next-line
    delete passwords[id];
    await setPasswords(passwords);
  });
};
