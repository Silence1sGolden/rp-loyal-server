import express from 'express';
import { regCodeVerify, regUser } from './user/reg';
import { getProfile, getUserCheck } from './user/utils';
import { authCodeVerify, authUser } from './user/auth';
import cors from 'cors';
import { CustomError, ERROR_MESSAGE, verifyToken } from './utils/service';
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
app.use('/api/users/:id', (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return CustomError(res, 401, 'Доступ запрещён.');
  }

  try {
    verifyToken(auth);
  } catch (error) {
    const err = error as Error;

    if (err.message === 'jwt expired') {
      return CustomError(res, 400, 'Данные некорректны.');
    }

    if (err.message === 'invalid signature') {
      // TODO
      // сделать отправку сообщения на почту о том,
      // что в аккаунт пытаются войти
      return CustomError(res, 500, ERROR_MESSAGE, err);
    }

    return CustomError(res, 500, ERROR_MESSAGE, err);
  }
  next();
});
app.use('/api/users/:id', getUserCheck);
app.get('/api/users/:id', getProfile);
// auth
app.post('/api/auth', authUser);
// registration
app.post('/api/users', regUser);
// verify
app.post('/api/v/reg', regCodeVerify);
app.post('/api/v/auth', authCodeVerify);
