import express from 'express';
import cors from 'cors';
import path from 'path';
import { usersRouter } from './routers/users.router';
import { db } from './db';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../test.html'));
});

app.get('/api/health', async (req, res) => {
  try {
    const [result] = await db.query(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      ['Иван', 'ivan@example.com'],
    );

    const [users] = await db.query('SELECT * FROM users');

    res.send({ status: true, data: 'OK', database: 'CONNECTED', users: users });
  } catch (error) {
    res.status(500).send({ status: false, data: 'FAIL', error: error });
  }
});

app.use('/api/v1', usersRouter);
