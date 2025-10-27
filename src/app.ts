import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { profilesRouter } from './api/profiles';
import { roomsRouter } from './api/rooms';
import { rolesRouter } from './api/roles';
import { sessionRouter } from './api/session';
import { likesRouter } from './api/likes';
import { resetRouter } from './api/reset';
import path from 'path';
import { authRouter } from './api/auth';
import { registerRouter } from './api/register';
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html'));
});

app.use('/api/v1/auth', authRouter); // ok
app.use('/api/v1/register', registerRouter); // ok
app.use('/api/v1/refresh', sessionRouter); // ok
app.use('/api/v1/reset', resetRouter); // ok
app.use('/api/v1/profiles', profilesRouter); // ok
app.use('/api/v1/roles', rolesRouter); // ok
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/likes', likesRouter);
// api/v1/rewards
// app.use('/api/v1/rewards', checkAccessTokenHandler);
// app.post('/api/v1/rewards/:id', rewardsProfileHandler);
