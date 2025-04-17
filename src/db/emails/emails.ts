import { TEmail } from '@/utils/types';
import { Config, JsonDB } from 'node-json-db';

const emailsDB = new JsonDB(new Config('./src/db/emails/db', true, false, '/'));

export const getEmails = async (): Promise<TEmail[]> => {
  return await emailsDB.getData('/emails');
};

export const setEmails = async (emails: TEmail[]): Promise<void> => {
  await emailsDB.push('/emails', emails);
};

export const getEmailByID = async (id: string): Promise<TEmail | undefined> => {
  return await emailsDB.getData('/emails').then((emails: TEmail[]) => {
    return emails.find((item) => item._id === id);
  });
};

export const getEmailByEmail = async (
  email: string,
): Promise<TEmail | undefined> => {
  return await emailsDB.getData('/emails').then((emails: TEmail[]) => {
    return emails.find((item) => item.email === email);
  });
};

export const createEmail = async (id: string, email: string): Promise<void> => {
  return await emailsDB.getData('/emails').then(async (emails: TEmail[]) => {
    return await emailsDB.push('/emails', [
      ...emails,
      { _id: id, email: email, verify: false, active: null },
    ]);
  });
};

export const deleteEmail = async (id: string): Promise<void> => {
  return await getEmails().then(async (emails) => {
    return await setEmails(emails.filter((item) => item._id !== id));
  });
};

export const verifyEmail = async (id: string): Promise<void> => {
  return await emailsDB.getData('/emails').then(async (emails: TEmail[]) => {
    const currentEmail = emails.find((item) => item._id === id);

    if (currentEmail) {
      currentEmail.verify = true;
      await setEmails([
        ...emails.filter((item) => item._id !== id),
        currentEmail,
      ]);
    } else {
      throw new Error('Такой почты не существует');
    }
  });
};

export const checkEmailForSame = async (email: string): Promise<boolean> => {
  return await emailsDB.getData('/emails').then((emails: TEmail[]) => {
    return Boolean(emails.find((item) => item.email === email));
  });
};

export const checkEmailVerify = async (
  email: string,
): Promise<boolean | undefined> => {
  return await emailsDB.getData('/emails').then((emails: TEmail[]) => {
    return emails.find((item) => item.email === email)?.verify;
  });
};
