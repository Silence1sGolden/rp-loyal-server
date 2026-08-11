import express from 'express';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';
import { db } from './db.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (_, res) => {
  res.send('Hello');
});

app.get('/api/health', async (_, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');

    res.send({ status: true, data: 'OK', database: 'CONNECTED', users: users });
  } catch (error) {
    res.status(500).send({ status: false, data: 'FAIL', error: error });
  }
});

app.use('/api/v1', usersRouter);
