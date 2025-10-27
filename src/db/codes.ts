import { TCodeSession } from '@/models/types';
import { Config, JsonDB } from 'node-json-db';
import path from 'path';

const codesDB = new JsonDB(
  new Config(path.join(__dirname, 'auth.db.json'), true, false, '/'),
);

const getCodes = async (): Promise<TCodeSession[]> => {
  return await codesDB.getData('/codes');
};

const setCodes = async (codes: TCodeSession[]): Promise<void> => {
  await codesDB.push('/codes', codes);
};

export const findCode = async (
  code: number,
): Promise<TCodeSession | undefined> => {
  const codes = await getCodes();
  if (codes) {
    return codes.find((item) => item.code === code);
  }
};

export const createCode = async (payload: TCodeSession): Promise<void> => {
  const codes = await getCodes();
  codes.push(payload);
  if (codes) {
    await setCodes(codes);
  }
};

export const deleteCode = async (code: number): Promise<void> => {
  const codes = await getCodes();
  // eslint-disable-next-line
  delete codes[code];
  await setCodes(codes);
};

export const clearExpiredCodes = async () => {
  try {
    const codes = await getCodes();
    const keys = Object.keys(codes);

    keys.forEach(async (code) => {
      if (Date.now() - codes[+code].createdAt > 5 * 60 * 1000) {
        await deleteCode(+code);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
