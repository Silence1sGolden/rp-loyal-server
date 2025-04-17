import { TCodeVerify } from '@/utils/types';
import { Config, JsonDB } from 'node-json-db';

const codesDB = new JsonDB(new Config('./src/db/codes/db', true, false, '/'));

export const getCodes = async (): Promise<TCodeVerify> => {
  return await codesDB.getData('/codes');
};
export const findCode = async (
  code: number,
): Promise<TCodeVerify | undefined> => {
  return await getCodes().then(async (codes) => {
    return codes[code];
  });
};
export const createCode = async (
  email: string,
  code: number,
): Promise<void> => {
  return await codesDB.getData('/codes').then(async (codes: TCodeVerify) => {
    codes[code] = { email: email, createdAt: Date.now() };
    return await codesDB.push('/codes', codes);
  });
};
export const deleteCode = async (code: number): Promise<void> => {
  return await getCodes().then(async (codes) => {
    delete codes[code];
    return await codesDB.push('/codes', codes);
  });
};
