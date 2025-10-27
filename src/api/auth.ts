import { sendAuthVerifyMail } from '@/transporter';
import * as bcrypt from 'bcrypt';
import { CustomError, getRandomCode } from '@/utils/service';
import { Router } from 'express';
import { createCode, deleteCode, findCode } from '@/db/codes';
import { getUserByEmail } from '@/db/users';
import { randomUUID } from 'crypto';
import { ILogin } from '../models/types';
import { getPasswordByUserID } from '@/db/passwords';

export const authRouter = Router();

authRouter.post('/', async (req, res) => {
  try {
    const { email, password }: ILogin = req.body;
    const userData = await getUserByEmail(email);

    if (!userData) {
      CustomError(res, 404);
      return;
    }

    const hash = await getPasswordByUserID(userData.id);

    if (!hash) {
      CustomError(res, 404);
      return;
    }

    const passwordStatus = await bcrypt.compare(password, hash);

    if (!passwordStatus) {
      CustomError(res, 400);
      return;
    }

    const code = getRandomCode();
    const info = await sendAuthVerifyMail([userData.email], code);

    if (!info) {
      CustomError(res, 500);
      return;
    }

    await createCode({
      _id: randomUUID(),
      code: code,
      createdAt: Date.now(),
      email: email,
      username: userData.username,
      password: '',
    });

    res
      .status(200)
      .send({ status: true, data: 'The code has been sent to your email.' });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

authRouter.post('/:code', async (req, res) => {
  const code = +req.params.code;

  if (!code) {
    CustomError(res, 400);
    return;
  }

  try {
    const paylod = await findCode(code);
    await deleteCode(code);

    if (!paylod) {
      CustomError(res, 400);
      return;
    }

    if (paylod.createdAt + 5 * 60 * 1000 < Date.now()) {
      CustomError(res, 400);
      return;
    }

    res.status(200).send({ status: true, data: '' });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
