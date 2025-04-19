import { Config, JsonDB } from 'node-json-db';
import { TEmail } from './types';
import { UUID } from 'crypto';

const emailsDB = new JsonDB(new Config('./src/db/emails/db', true, false, '/'));

const getEmails = async (): Promise<TEmail> => {
  return await emailsDB.getData('/emails');
};

const setEmails = async (emails: TEmail): Promise<void> => {
  return await emailsDB.push('/emails', emails);
};

export const createEmail = async (email: string, id: UUID): Promise<void> => {
  return await getEmails().then((emails) => {
    emails[email] = id;
    return setEmails(emails);
  });
};

export const deleteEmail = async (email: string): Promise<void> => {
  return await getEmails().then(async (emails) => {
    delete emails[email];
    return await setEmails(emails);
  });
};

export const getIDByEmail = async (
  email: string,
): Promise<UUID | undefined> => {
  return await getEmails().then(async (emails) => {
    return emails[email];
  });
};
