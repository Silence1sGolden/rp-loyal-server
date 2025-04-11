import { getCodes, getEmails, getUsers, writeEmails } from '@/db/db';
import { TLogin } from '@/utils/types';
import { BASE_URL, CustomError, ERROR_MESSAGE } from '@/utils/utils';
import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';

export const emailVerify: RequestHandler = async (req, res) => {
  const { key } = req.params;

  if (key) {
    try {
      const emails = await getEmails();
      const email = emails.find((item) =>
        item.key ? item.key.key == key : false,
      );

      if (email) {
        if (email.key!.createdAt + 7200000 > Date.now()) {
          email.verify = true;
          const newEmails = emails.filter((item) => item.email !== email.email);
          delete email.key;
          await writeEmails([...newEmails, email]);
          res.redirect(BASE_URL);
        } else {
          CustomError(res, 404, 'Ссылка не действительна.');
        }
      } else {
        CustomError(res, 404, 'Такого токена не существует.');
      }
    } catch (err) {
      CustomError(res, 500, ERROR_MESSAGE, err);
      if (typeof err == 'string') {
        throw new Error(err);
      }
    }
  } else {
    CustomError(res, 404, 'Токен не был обнаружен.');
  }
};

export const codeVerify: RequestHandler = async (req, res) => {
  const data: TLogin & { code: number } = req.body;

  try {
    const codes = await getCodes();
    const users = await getUsers();
    const user = users.find(
      (item) => item.email === codes[data.code.toString()],
    );

    if (user && user.email === data.email) {
      res
        .status(200)
        .cookie('accessToken', randomUUID(), {
          maxAge: Date.now() + 120000,
        })
        .send({
          status: true,
          data: { refreshToken: randomUUID(), user: user },
        });
    } else {
      CustomError(res, 404, 'Почта или пароль неверны.');
    }
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
};
