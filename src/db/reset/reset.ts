import { Config, JsonDB } from 'node-json-db';
import { TResetLink } from './types';
import { UUID } from 'crypto';

const resetDB = new JsonDB(new Config('./src/db/reset/db', true, false, '/'));

export const getResets = async (): Promise<TResetLink> => {
  return await resetDB.getData('/reset');
};

export const setResets = async (resets: TResetLink): Promise<void> => {
  return await resetDB.push('/reset', resets);
};

export const getReset = async (link: string): Promise<UUID | undefined> => {
  const resets = await getResets();

  return resets[link];
};

export const deleteReset = async (link: string): Promise<void> => {
  const resets = await getResets();

  delete resets[link];

  return await setResets(resets);
};

export const createReset = async (link: string, id: UUID): Promise<void> => {
  const resets = await getResets();

  resets[link] = id;

  return await setResets(resets);
};
