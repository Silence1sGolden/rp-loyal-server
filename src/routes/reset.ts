import { getEmailByEmail, getEmailByID } from '@/db/emails/emails';
import { createPassword, deletePassword } from '@/db/passwords/passwords';
import { createReset, getReset } from '@/db/reset/reset';
import { sendResetMail } from '@/transporter';
import { checkFields, CustomError, ERROR_MESSAGE } from '@/utils/service';
import { randomUUID } from 'crypto';
import { Router } from 'express';

export const resetRouter = Router();

resetRouter.post('/', async (req, res) => {
  const check = checkFields<{ email: string }>(req.body, ['email']);

  if (check) {
    return CustomError(res, 404, 'Необходимые данные отсутствуют.');
  }

  try {
    const data = await getEmailByEmail(req.body.email);

    if (!data) {
      return CustomError(
        res,
        400,
        'Пользователя с такой почтой не существует.',
      );
    }

    const link = randomUUID();

    await createReset(link, data.id);
    await sendResetMail([data.email], link);
    res
      .status(200)
      .send({ status: true, data: 'Письмо отправлено на вашу почту.' });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

resetRouter.post('/:link', async (req, res) => {
  const check = checkFields<{ password: string }>(req.body, ['password']);

  if (check) {
    return CustomError(res, 400, check);
  }

  if (!req.params.link) {
    return CustomError(res, 400, 'Такой ссылки не существует.');
  }

  const link = req.params.link;

  try {
    const id = await getReset(link);

    if (!id) {
      return CustomError(res, 400, 'ID не найден.');
    }

    const email = await getEmailByID(id);

    if (!email) {
      return CustomError(res, 400, 'Такой почты не суещствует.');
    }

    await deletePassword(email.email);
    await createPassword(email.email, req.body.password);

    res.status(200).send({ status: true, data: 'Пароль изменен.' });
  } catch (err) {
    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
