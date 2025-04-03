import express from 'express';
import { add, addCheck, find, findCheck } from './slice/user';
export const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ status: true, data: 'OK' });
});

// user
app.use('/api/users', findCheck);
app.post('/api/users', find);
app.use('/api/users/add', addCheck);
app.post('/api/users/add', add);
