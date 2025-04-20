import express from 'express';
import { regCodeVerify, regUser } from './user/reg';
import { getProfile, refreshSession } from './user/utils';
import { authCodeVerify, authUser } from './user/auth';
import cors from 'cors';
import {
  CustomError,
  ERROR_MESSAGE,
  getTokenPayload,
  verifyToken,
} from './utils/service';
import { getSession } from './db/sessions/sessions';
import { UUID } from 'crypto';
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>RP-loyal</h1>');
});

app.get('/api', (req, res) => {
  res.send({ status: true, data: 'OK' });
});

// ---USER---
// get
app.use('/api/v/', async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return CustomError(res, 401, 'Доступ запрещён.');
  }

  try {
    const data = getTokenPayload<{ id: UUID; sessionID: UUID }>(auth);
    const session = await getSession(data.sessionID);

    if (!session) {
      return CustomError(res, 401, 'Токен не дейстивтелен.');
    }

    verifyToken(auth, session.key);

    next();
  } catch (error) {
    const err = error as Error;

    if (err.message === 'jwt expired') {
      return CustomError(res, 401, 'Токен не дейстивтелен.');
    }

    if (err.message === 'invalid signature') {
      // TODO
      // сделать отправку сообщения на почту о том,
      // что в аккаунт пытаются войти
      return CustomError(res, 500, ERROR_MESSAGE, err);
    }

    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
});
app.get('/api/v/users/:id', getProfile);
// auth
app.post('/api/auth', authUser);
// registration
app.post('/api/users', regUser);
// verify
// /api/c(what Confirm)
app.post('/api/c/reg', regCodeVerify);
app.post('/api/c/auth', authCodeVerify);
app.post('/api/refresh', refreshSession);
