import { TLogin } from '@/utils/types';
import { createToken, CustomError, ERROR_MESSAGE } from '@/utils/service';
import { RequestHandler } from 'express';
import { deleteCode, findCode, getCodes } from '@/db/codes/codes';
import { getUserByID } from '@/db/users/users';
import {
  getVerifyEmails,
  setVerifyEmails,
} from '@/db/verifyEmails/verifyEmails';
import { getEmailByEmail, verifyEmail } from '@/db/emails/emails';
import { resAuthUser } from './utils';

export const emailVerify: RequestHandler = async (req, res) => {
  const { key } = req.params;

  if (key) {
    try {
      const emails = await getVerifyEmails();
      const email = emails.find((item) => item.key === key);

      if (email) {
        if (email.createdAt < Date.now() + 5 * 60 * 1000) {
          await verifyEmail(email.email);
          await setVerifyEmails(emails.filter((item) => item.key !== key));
          res.status(200).send({ status: true, data: 'Почта подтверждена.' });
        } else {
          await setVerifyEmails(emails.filter((item) => item.key !== key));
          CustomError(res, 404, 'Ссылка не действительна.');
        }
      } else {
        CustomError(res, 404, 'Такого токена не существует.');
      }
    } catch (err) {
      CustomError(res, 500, ERROR_MESSAGE, err);
    }
  } else {
    CustomError(res, 404, 'Токен не найден.');
  }
};

export const codeVerify: RequestHandler = async (req, res) => {
  const { email, code }: TLogin & { code: number } = req.body;

  try {
    const currentCode = await findCode(code);

    if (currentCode) {
      const currentEmail = await getEmailByEmail(email);

      if (currentEmail) {
        await deleteCode(code);
        await resAuthUser(res, currentEmail._id);
      } else {
        console.error(
          `${email} не был найден в базе данных, но на данную почту был отправлен код верификации!`,
        );
        CustomError(res, 404, 'Такого аккаунта не существует.');
      }
    } else {
      CustomError(res, 404, 'Код не найден.');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
