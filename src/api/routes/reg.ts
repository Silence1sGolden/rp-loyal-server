import { sendAuthVerifyMail } from '@/transporter';
import { TRegister } from '@/utils/types';
import {
  authUserWithResponse,
  checkFields,
  createNewProfile,
  CustomError,
  ERROR_MESSAGE,
  getRandomCode,
} from '@/utils/service';
import { Router } from 'express';
import { createProfile } from '@/db/profiles/profiles';
import { createPassword, getPasswordByEmail } from '@/db/passwords/passwords';
import { createCode, deleteCode, findCode } from '@/db/codes/codes';
import { randomUUID } from 'crypto';
import { createEmail } from '@/db/emails/emails';

export const registerRouter = Router();

registerRouter.post('/', async (req, res) => {
  const user: TRegister = req.body;
  const checkBody = checkFields(user, ['email', 'password', 'username']);

  if (checkBody) {
    CustomError(res, 400, checkBody); return;
  }

  try {
    if (await getPasswordByEmail(user.email)) {
      CustomError(
        res,
        400,
        'Пользователь с такой почтой уже существует.',
      ); return;
    }

    const id = randomUUID();
    const code = getRandomCode();

    await createCode(id, code, {
      email: user.email,
      password: user.password,
      username: user.username,
    });

    const info = await sendAuthVerifyMail([user.email], code);

    if (!info) {
      CustomError(
        res,
        500,
        `Письмо не удалось отправить на почту ${user.email}. Пожалуйста, попробуйте позже.`,
      ); return;
    }
    res.status(200).send({ status: true, data: 'Код отправлен на почту.' });
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});

registerRouter.post('/code', async (req, res) => {
  const { code } = req.body;

  try {
    const user = await findCode(code);

    if (!user) {
      CustomError(res, 400, 'Код не действителен.'); return;
    }

    if (user.createdAt + 5 * 60 * 1000 < Date.now()) {
      CustomError(res, 400, 'Код не действителен.'); return;
    }

    const { _id, username, email, password } = user;
    const profile = createNewProfile(_id, username!);

    await createPassword(email!, password!);
    await createProfile(profile);
    await createEmail({ email: user.email!, id: user._id });
    await deleteCode(code);
    await authUserWithResponse(res, _id);
  } catch (err) {
    CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
