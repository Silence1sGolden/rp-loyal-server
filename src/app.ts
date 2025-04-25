import express from 'express';
import { registerRouter } from './routes/reg';
import { authRouter } from './routes/auth';
import cors from 'cors';
import { profilesRouter } from './routes/profiles';
import { roomsRouter } from './routes/rooms';
import { rolesRouter } from './routes/roles';
import { sessionRouter } from './routes/session';
import { likesRouter } from './routes/likes';
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>RP-loyal</h1>');
});

app.get('/api/v1', (req, res) => {
  res.send({ status: true, data: 'OK' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/refresh', sessionRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/likes', likesRouter);
// api/v1/rewards
// app.use('/api/v1/rewards', checkAccessTokenHandler);
// app.post('/api/v1/rewards/:id', rewardsProfileHandler);
