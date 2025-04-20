import { Config, JsonDB } from 'node-json-db';
import { TEmail } from './types';
import { UUID } from 'crypto';

const emailsDB = new JsonDB(new Config('./src/db/emails/db', true, false, '/'));

const getEmails = async (): Promise<TEmail[]> => {
  return await emailsDB.getData('/emails');
};

const setEmails = async (emails: TEmail[]): Promise<void> => {
  return await emailsDB.push('/emails', emails);
};

export const createEmail = async (email: TEmail): Promise<void> => {
  return await getEmails().then((emails) => {
    return setEmails([...emails, email]);
  });
};

export const getEmailByID = async (id: UUID): Promise<TEmail | undefined> => {
  return await getEmails().then(async (emails) => {
    return emails.find((email) => email.id === id);
  });
};

export const getEmailByEmail = async (
  email: string,
): Promise<TEmail | undefined> => {
  return await getEmails().then(async (emails) => {
    return emails.find((item) => item.email === email);
  });
};

export const deleteEmailByID = async (id: UUID): Promise<void> => {
  return await getEmails().then(async (emails) => {
    return await setEmails(emails.filter((email) => email.id !== id));
  });
};

export const deleteEmailByEmail = async (email: string): Promise<void> => {
  return await getEmails().then(async (emails) => {
    return await setEmails(emails.filter((item) => item.email !== email));
  });
};
