import { TAccessTokenBody } from '@/db/sessions/types';
import {
  checkAccessTokenHandler,
  CustomError,
  getCookie,
  getTokenPayload,
} from '@/utils/service';
import { Router } from 'express';

export const rolesRouter = Router();

rolesRouter.use(checkAccessTokenHandler);

// TODO
// Исправить и доделать
// app.get('/api/v1/roles', getRolesHandler);
rolesRouter.get('/', async (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const token = getCookie('accessToken', cookie);

  if (!token) {
    return CustomError(res, 401, 'Вы не авторизованы.');
  }

  const { id } = getTokenPayload<TAccessTokenBody>(token);
  const roomID = req.params.id;

  if (!roomID) {
    return CustomError(res, 400, 'Комнаты не существует.');
  }
});

// TODO
// app.get('/api/v1/roles/:id', getRolesByIDHandler);
// app.delete('/api/v1/roles/:id', deleteRolesHandler);
// app.post('/api/v1/roles/:id', updateRolesHandler);
