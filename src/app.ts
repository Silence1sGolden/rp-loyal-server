import express from 'express';
import { regCodeVerifyHandler, regUserHandler } from './router/user/reg';
import { getProfileHandler, refreshSessionHandler } from './router/user/utils';
import { authCodeVerifyHandler, authUserHandler } from './router/user/auth';
import cors from 'cors';
import {
  checkAccessTokenHandler,
  checkRefreshTokenHandler,
} from './utils/service';
import {
  createRolesHandler,
  deleteRolesHandler,
  getRolesByIDHandler,
  updateRolesHandler,
} from './router/roles/roles';
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

// ---SECURE---
app.use('/api/v/', checkAccessTokenHandler);

// ---USER---
// users
app.get('/api/v/users/:id', getProfileHandler);
// auth
app.post('/api/auth', authUserHandler);
// registration
app.post('/api/users', regUserHandler);
// verify
app.post('/api/c/reg', regCodeVerifyHandler);
app.post('/api/c/auth', authCodeVerifyHandler);
app.use('/api/refresh', checkRefreshTokenHandler);
app.post('/api/refresh', refreshSessionHandler);

// ---ROLES---
app.get('/api/v/roles/:id', getRolesByIDHandler);
app.delete('/api/v/roles/:id', deleteRolesHandler);
app.post('/api/v/profile/roles', createRolesHandler);
app.post('/api/v/roles/:id', updateRolesHandler);
