import express from 'express';
import { registerRouter } from './routes/reg';
import { authRouter } from './routes/auth';
import cors from 'cors';
import { profilesRouter } from './routes/profiles';
import { roomsRouter } from './routes/rooms';
import { rolesRouter } from './routes/roles';
import { sessionRouter } from './routes/session';
import { likesRouter } from './routes/likes';
import cookieParser from 'cookie-parser';
import { getTokenPayload, verifyToken } from './utils/token';
import { TAccessTokenBody } from './db/sessions/types';
import { getSessionByID } from './db/sessions/sessions';
import { resetRouter } from './routes/reset';
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('<h1>RP-loyal</h1>');
});

app.get('/api/v1', async (req, res) => {
  const accessToken = req.headers.authorization;

  if (accessToken) {
    const { sessionID } = getTokenPayload<TAccessTokenBody>(accessToken);

    const session = await getSessionByID(sessionID);

    if (session) {
      try {
        verifyToken(accessToken, session.key);
        res.status(200).send({
          status: true,
          data: {
            server: true,
            session: true,
          },
        });
        return;
      } catch (err) {
        console.log(err);
      }
    }
  }

  res.status(200).send({
    status: true,
    data: {
      server: true,
      session: false,
    },
  });
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
