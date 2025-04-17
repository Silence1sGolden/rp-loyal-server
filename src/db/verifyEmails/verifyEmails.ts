import { TVerifyEmail } from '@/utils/types';
import { UUID } from 'crypto';
import { Config, JsonDB } from 'node-json-db';

const verifyEmailsDB = new JsonDB(
  new Config('./src/db/verifyEmails/db', true, false, '/'),
);

export const getVerifyEmails = async (): Promise<TVerifyEmail[]> => {
  return await verifyEmailsDB.getData('/verifyEmails');
};

export const setVerifyEmails = async (
  verifyEmails: TVerifyEmail[],
): Promise<void> => {
  return await verifyEmailsDB.push('/verifyEmails', verifyEmails);
};

export const createVerifyEmail = async (
  email: string,
  uuid: UUID,
): Promise<void> => {
  return await verifyEmailsDB
    .getData('/verifyEmails')
    .then(async (verifyEmails: TVerifyEmail[]) => {
      return await verifyEmailsDB.push('/verifyEmails', [
        ...verifyEmails,
        { email: email, key: uuid, createdAt: Date.now() },
      ]);
    });
};

export const deleteVerifyEmail = async (uuid: UUID): Promise<void> => {
  return verifyEmailsDB
    .getData('verifyEmails')
    .then(async (verifyEmails: TVerifyEmail[]) => {
      return await verifyEmailsDB.push(
        'verifyEmails',
        verifyEmails.filter((item) => item.key !== uuid),
      );
    });
};

export const findVerifyEmailUUID = async (uuid: UUID): Promise<boolean> => {
  return await verifyEmailsDB
    .getData('verifyEmails')
    .then(async (verifyEmails: TVerifyEmail[]) => {
      return await Boolean(verifyEmails.find((item) => item.key === uuid));
    });
};
