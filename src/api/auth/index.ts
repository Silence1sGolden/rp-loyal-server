import { sendAuthVerifyMail } from '@/transporter';
import * as bcrypt from 'bcrypt';
import {
  checkFields,
  CustomError,
  getRandomCode,
  setAuthUser,
} from '@/utils/service';
import { Router } from 'express';
import { createCode, deleteCode, findCode } from '@/db/codes';
import { getEmailByEmail } from '@/db/emails';
import { ILogin } from './types';
import { getPasswordByID } from '@/db/passwords';

export const authRouter = Router();

authRouter.post('/', async (req, res) => {
  const user: ILogin = req.body;
  const check = checkFields(user, ['email', 'password']);

  if (check) {
    CustomError(res, 400);
    return;
  }

  const profileData = await getEmailByEmail(user.email);

  if (!profileData) {
    CustomError(res, 400);
    return;
  }

  const encrypted = await getPasswordByID(profileData.id);

  if (!encrypted || !(await bcrypt.compare(user.password, encrypted))) {
    CustomError(res, 400);
    return;
  }

  try {
    const code = getRandomCode();
    const info = await sendAuthVerifyMail([profileData.email], code);

    if (!info) {
      CustomError(res, 500);
      return;
    }

    await createCode(profileData.id, code, req.body);
    res
      .status(200)
      .send({ status: true, data: 'The code has been sent to your email.' });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

authRouter.post('/code', async (req, res) => {
  const { code } = req.body;

  try {
    const codeData = await findCode(code);

    if (!codeData) {
      CustomError(res, 400);
      return;
    }

    if (codeData.createdAt + 5 * 60 * 1000 < Date.now()) {
      await deleteCode(code);
      CustomError(res, 400);
      return;
    }

    await deleteCode(code);
    const tokens = await setAuthUser(codeData._id);

    res.status(200).send({ status: true, data: tokens });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
