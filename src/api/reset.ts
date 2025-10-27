import { getUserByID, getUserByEmail } from '@/db/users';
import { createReset, getReset } from '@/db/reset';
import { sendResetMail } from '@/transporter';
import { checkFields, CustomError } from '@/utils/service';
import { randomUUID } from 'crypto';
import { Router } from 'express';
import { createPassword, deletePasswordByUserID } from '@/db/passwords';

export const resetRouter = Router();

resetRouter.post('/', async (req, res) => {
  const check = checkFields<{ email: string }>(req.body, ['email']);

  if (check) {
    CustomError(res, 404, 'Необходимые данные отсутствуют.');
    return;
  }

  try {
    const data = await getUserByEmail(req.body.email);

    if (!data) {
      CustomError(res, 400, 'Пользователя с такой почтой не существует.');
      return;
    }

    const link = randomUUID();

    await createReset(link, data.id);
    await sendResetMail([data.email], link);
    res
      .status(200)
      .send({ status: true, data: 'Письмо отправлено на вашу почту.' });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});

resetRouter.post('/:link', async (req, res) => {
  const check = checkFields<{ password: string }>(req.body, ['password']);

  if (check) {
    CustomError(res, 400, check);
    return;
  }

  if (!req.params.link) {
    CustomError(res, 400, 'Такой ссылки не существует.');
    return;
  }

  const link = req.params.link;

  try {
    const id = await getReset(link);

    if (!id) {
      CustomError(res, 400, 'ID не найден.');
      return;
    }

    const user = await getUserByID(id);

    if (!user) {
      CustomError(res, 400, 'Такой почты не суещствует.');
      return;
    }

    await deletePasswordByUserID(user.id);
    await createPassword(user.id, req.body.password);

    res.status(200).send({ status: true, data: 'Пароль изменен.' });
  } catch (err) {
    CustomError(res, 500);
    return;
  }
});
