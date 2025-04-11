import express from 'express';
import {
  regCheckFields,
  regCheckForSameEmail,
  regSendMail,
  regUser,
} from './user/reg';
import { codeVerify, emailVerify } from './user/verify';
import { getUser, getUserCheck } from './user/utils';
import {
  authCheckFields,
  authEmailCheck,
  authPasswordCheck,
  authSendMail,
} from './user/auth';
import cors from 'cors';
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
app.use('/api/users/:id', getUserCheck);
app.get('/api/users/:id', getUser);
// auth
app.use('/api/auth', authCheckFields);
app.use('/api/auth', authEmailCheck);
app.use('/api/auth', authPasswordCheck);
app.post('/api/auth', authSendMail);
// registration
app.use('/api/users', regCheckFields);
app.use('/api/users', regCheckForSameEmail);
app.use('/api/users', regSendMail);
app.post('/api/users', regUser);
// verify
app.get('/api/v/:key', emailVerify);
app.post('/api/v/auth', codeVerify);
