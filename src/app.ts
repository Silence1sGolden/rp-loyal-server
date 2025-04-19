import express from 'express';
import {
  regCheckFields,
  regCheckForSameEmail,
  regCheckToken,
  regCreateTokenAndSendMail,
} from './user/reg';
import { codeVerify } from './user/verify';
import { getProfile, getUserCheck } from './user/utils';
import {
  authCheckFields,
  authEmailCheck,
  authPasswordCheck,
  authSendMail,
} from './user/auth';
import cors from 'cors';
import { CustomError, verifyToken } from './utils/service';
export const app = express();

app.use(express.json());
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
    CustomError(res, 401, 'Доступ запрещён.');
  } else {
    try {
      verifyToken<{ id: string }>(auth);
      next();
    } catch (err) {
      // МОЖЕТ БЫТЬ ОШИБКА ПОДЛЕННОСТИ
      console.log(err);
      CustomError(res, 401, 'Ошибка аутентификации.', err);
    }
  }
});
app.use('/api/users/:id', getUserCheck);
app.get('/api/users/:id', getProfile);
// auth
app.use('/api/auth', authCheckFields);
app.use('/api/auth', authEmailCheck);
app.use('/api/auth', authPasswordCheck);
app.post('/api/auth', authSendMail);
// registration
app.use('/api/users', regCheckFields);
app.use('/api/users', regCheckForSameEmail);
app.post('/api/users', regCreateTokenAndSendMail);
// verify
app.get('/api/v/r/:key', regCheckToken);
app.post('/api/v/', codeVerify);
