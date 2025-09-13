import { Config, JsonDB } from 'node-json-db';
import { TCodeEmail, TCodeVerify } from './types';
import { TLogin, TRegister } from '@/utils/types';
import { Response } from 'express';
import { UUID } from 'crypto';

const codesDB = new JsonDB(new Config('./src/db/codes/db', true, false, '/'));

const getCodes = async (): Promise<TCodeVerify> => {
  return await codesDB.getData('/codes');
};
export const findCode = async (
  code: number,
): Promise<TCodeEmail | undefined> => {
  return await getCodes().then(async (codes) => {
    return codes[code];
  });
};
export const createCode = async (
  id: UUID,
  code: number,
  data?: (TRegister | TLogin) & { res?: Response },
): Promise<void> => {
  await codesDB.getData('/codes').then(async (codes: TCodeVerify) => {
    codes[code] = {
      _id: id,
      createdAt: Date.now(),
      email: data?.email,
      password: data?.password,
    };
    await codesDB.push('/codes', codes);
  });
};
export const deleteCode = async (code: number): Promise<void> => {
  await getCodes().then(async (codes) => {
    // eslint-disable-next-line
    delete codes[code];
    await codesDB.push('/codes', codes);
  });
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
