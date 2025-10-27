import { sendAuthVerifyMail } from '@/transporter';
import {
  checkFields,
  CustomError,
  getBlankProfile,
  getRandomCode,
} from '@/utils/service';
import { Router } from 'express';
import { createProfile } from '@/db/profiles';
import { createCode, deleteCode, findCode } from '@/db/codes';
import { randomUUID } from 'crypto';
import { createUser, getUserByEmail } from '@/db/users';
// import { JWT_KEY } from '@/data/constans';
// import ms from 'ms';
// import { createToken } from '@/utils/token';
import { IRegister } from '../models/types';
import { createPassword } from '@/db/passwords';

export const registerRouter = Router();

registerRouter.post('/', async (req, res) => {
  try {
    const body: IRegister = req.body;
    const check = checkFields(body, ['email', 'password', 'username']);

    if (check) {
      CustomError(res, 400);
      return;
    }

    if (await getUserByEmail(body.email)) {
      CustomError(res, 400);
      return;
    }

    const id = randomUUID();
    const code = getRandomCode();

    await createCode({ _id: id, code: code, createdAt: Date.now(), ...body });

    const info = await sendAuthVerifyMail([body.email], code);

    if (!info) {
      deleteCode(code);
      CustomError(res, 500);
      return;
    }
    res
      .status(200)
      .send({ status: true, data: 'The code has been sent to your email.' });
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});

registerRouter.post('/:code', async (req, res) => {
  const code = +req.params.code;

  if (!code) {
    CustomError(res, 400);
    return;
  }

  try {
    const payload = await findCode(code);
    await deleteCode(code);

    if (!payload) {
      CustomError(res, 400);
      return;
    }

    if (payload.createdAt + 5 * 60 * 1000 < Date.now()) {
      CustomError(res, 400);
      return;
    }

    const { username, email, password } = payload;
    const newUser = await createUser(email, username);

    if (!newUser) {
      CustomError(res, 400);
      return;
    }

    const profile = getBlankProfile({
      userID: newUser.id,
      username: newUser.username,
    });
    // const newSessionID = randomUUID();
    // const accessToken = createToken(
    //   { userID: newUser.id, sessionID: newSessionID },
    //   JWT_KEY,
    //   Date.now() + ms('5MIN'),
    // );
    // const refreshToken = createToken(
    //   { userID: newUser.id, sessionID: newSessionID },
    //   JWT_KEY,
    //   Date.now() + ms('24HOUR'),
    // );

    await createPassword(newUser.id, password);
    await createProfile(profile);
  } catch (err) {
    console.log(err);
    CustomError(res, 500);
  }
});
