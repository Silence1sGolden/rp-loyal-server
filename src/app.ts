import express from 'express';
import { registerRouter } from './routes/reg';
import { authRouter } from './routes/auth';
import cors from 'cors';
import { checkAccessTokenHandler } from './utils/service';
import { profilesRouter } from './routes/profiles';
import { roomsRouter } from './routes/rooms';
import { rolesRouter } from './routes/roles';
import { sessionRouter } from './routes/session';
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
// api/v1/auth
app.use('/api/v1/auth', authRouter);
// api/v1/register
app.use('/api/v1/register', registerRouter);
// api/v1/refresh
app.use('/api/v1/refresh', sessionRouter);
// api/v1/profiles
app.use('/api/v1/profiles', profilesRouter);
// api/v1/roles
app.use('/api/v1/roles', rolesRouter);
// api/v1/rooms
app.use('/api/v1/rooms', roomsRouter);
// api/v1/likes
app.use('/api/v1/likes', checkAccessTokenHandler);
app.get('/api/v1/likes/:id', likesProfileHandler);
// api/v1/rewards
app.use('/api/v1/rewards', checkAccessTokenHandler);
app.post('/api/v1/rewards/:id', rewardsProfileHandler);
