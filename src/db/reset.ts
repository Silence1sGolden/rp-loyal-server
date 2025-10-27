import { TResetLink } from '@/models/types';
import { Config, JsonDB } from 'node-json-db';
import path from 'path';

const resetDB = new JsonDB(
  new Config(path.join(__dirname, 'auth.db.json'), true, false, '/'),
);

export const getResets = async (): Promise<TResetLink> => {
  return await resetDB.getData('/reset');
};

export const setResets = async (resets: TResetLink): Promise<void> => {
  await resetDB.push('/reset', resets);
};

export const getReset = async (link: string): Promise<number | undefined> => {
  const resets = await getResets();

  return resets[link];
};

export const deleteReset = async (link: string): Promise<void> => {
  const resets = await getResets();

  delete resets[link];

  await setResets(resets);
};

export const createReset = async (
  link: string,
  userID: number,
): Promise<void> => {
  const resets = await getResets();

  resets[link] = userID;

  await setResets(resets);
};
