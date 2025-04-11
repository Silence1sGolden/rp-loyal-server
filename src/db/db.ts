import { TEmail, TEmailToken, TUser } from '@/utils/types';
import { Config, JsonDB } from 'node-json-db';
import * as bcrypt from 'bcrypt';

const db = new JsonDB(new Config('./src/db/royal', true, false, '/'));

// USER
export const getUsers = async (): Promise<TUser[]> => {
  return await db.getData('/users');
};
export const getUserByID = async (id: string): Promise<TUser | undefined> => {
  return await db
    .getData('/users')
    .then((users: TUser[]) => users.find((item) => item._id === id));
};
export const writeUser = async (user: TUser): Promise<void> => {
  return await db.getData('/users').then(async (users: TUser[]) => {
    return await db.push('/users', [...users, user]);
  });
};
export const getNextUserID = async (): Promise<string> => {
  return await db.getData('/users').then((users: TUser[]) => {
    return '0'.repeat(10 - (users.length + '').length) + (users.length + 1);
  });
};
//CODES
export const getCodes = async (): Promise<Record<string, string>> => {
  return await db.getData('/codes');
};
export const writeCode = async (email: string, code: number): Promise<void> => {
  return await db
    .getData('/codes')
    .then(async (codes: Record<number, string>) => {
      codes[code] = email;
      return await db.push('/codes', codes);
    });
};
// EMAIL
export const getEmails = async (): Promise<TEmail[]> => {
  return await db.getData('/emails');
};
export const findEmail = async (email: string): Promise<TEmail | undefined> => {
  return await db
    .getData('/emails')
    .then((emails: TEmail[]) => emails.find((item) => item.email === email));
};
// export const writeEmail = async (
//   email: string,
//   verifyKey: TEmailToken,
// ): Promise<void> => {
//   return await db.getData('/emails').then(async (emails: TEmail[]) => {
//     return await db.push(
//       '/emails',
//       emails.push({ email: email, verify: false, key: verifyKey }),
//     );
//   });
// };
export const writeEmails = async (emails: TEmail[]): Promise<void> => {
  await db.push('/emails', emails);
};
export const verifyEmail = async (email: string): Promise<void> => {
  return await db.getData('/emails').then(async (emails: TEmail[]) => {
    const currentEmail = emails.find((item) => item.email === email);

    if (currentEmail) {
      currentEmail.verify = true;
      delete currentEmail.key;
      return await db.push('/emails', emails);
    } else {
      throw new Error('Такого email не существует.');
    }
  });
};
export const checkEmailForSame = async (email: string): Promise<boolean> => {
  return await db.getData('/emails').then((emails: TEmail[]) => {
    return emails.find((item) => item.email === email) ? true : false;
  });
};
export const checkVerifyEmail = async (email: string): Promise<boolean> => {
  return await db.getData('/emails').then((emails: TEmail[]) => {
    const currentEmail = emails.find((item) => item.email === email);

    if (currentEmail) {
      return currentEmail.verify;
    } else {
      throw new Error('Такого email не существует.');
    }
  });
};

// PASSWORD
export const writePassword = async (
  email: string,
  password: string,
): Promise<void> => {
  return await db
    .getData('/pas')
    .then(async (passwords: Record<string, string>) => {
      return await bcrypt
        .hash(password, Math.round(Math.random() * (20 - 5) + 5))
        .then(async (hash: string) => {
          passwords[email] = hash;
          return await db.push('/pas', passwords);
        });
    });
};
export const getPasswords = async (): Promise<Record<string, string>> => {
  return await db.getData('/pas');
};
