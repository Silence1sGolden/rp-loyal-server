import { sendAuthVerifyMail } from '@/transporter';
import { TLogin } from '@/utils/types';
import * as bcrypt from 'bcrypt';
import {
  authUserWithResponse,
  checkFields,
  CustomError,
  ERROR_MESSAGE,
  getRandomCode,
} from '@/utils/service';
import { Router } from 'express';
import { getPasswordByEmail } from '@/db/passwords/passwords';
import { createCode, deleteCode, findCode } from '@/db/codes/codes';
import { getEmailByEmail } from '@/db/emails/emails';

export const authRouter = Router();

authRouter.post('/', async (req, res) => {
  const user: TLogin = req.body;
  const check = checkFields(user, ['email', 'password']);

  if (check) {
    CustomError(res, 400, check);
    return;
  }

  const encrypted = await getPasswordByEmail(user.email);

  if (!encrypted) {
    CustomError(res, 400, 'Аккаунта с такой почтой не существует.');
    return;
  }

  if (!(await bcrypt.compare(user.password, encrypted))) {
    CustomError(res, 400, 'Почта или пароль неверны.');
    return;
  }

  try {
    const code = getRandomCode();
    const email = await getEmailByEmail(user.email);

    if (!email) {
      CustomError(res, 400, 'Аккаунта с такой почтой не существует.');
      return;
    }

    const info = await sendAuthVerifyMail([email!.email], code);

    if (!info) {
      CustomError(
        res,
        500,
        `Письмо не удалось отправить на почту ${user.email}. Пожалуйста, попробуйте позже.`,
      );
      return;
    }

    await createCode(email!.id, code, req.body);
    res.status(200).send({ status: true, data: 'Код отправлен на почту.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

authRouter.post('/code', async (req, res) => {
  const { code } = req.body;

  try {
    const codeData = await findCode(code);

    if (!codeData) {
      CustomError(res, 400, 'Код не найден.');
      return;
    }

    if (codeData.createdAt + 5 * 60 * 1000 < Date.now()) {
      await deleteCode(code);
      CustomError(res, 400, 'Код не действителен.');
      return;
    }

    await deleteCode(code);
    await authUserWithResponse(res, codeData._id);
    return;
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
