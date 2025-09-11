import { getSessionByID } from '@/db/sessions/sessions';
import { TAccessTokenBody } from '@/db/sessions/types';
import { ERROR_MESSAGE } from '@/utils/service';
import { getTokenPayload, verifyToken } from '@/utils/token';
import { Server, Socket } from 'socket.io';

const socketUsers = new Set();

export const socketConnectionHandler = async (io: Server, socket: Socket) => {
  socketUsers.add(socket.id);
  socket.emit('message', 'Вы подключены!');
};

export const socketAuthHandler = async (io: Server, socket: Socket) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    socket.emit('error', 'Токен авторизации отсутсвтует.');
    return socket.disconnect(true);
  }

  try {
    const payload = getTokenPayload<TAccessTokenBody>(token);
    const session = await getSessionByID(payload.sessionID);
    if (!session) {
      socket.emit('error', 'Сессия отсутствует.');
      return socket.disconnect(true);
    }

    const data = await verifyToken<TAccessTokenBody>(token, session.key);

    if (data) {
      return;
    }

    socketConnectionHandler(io, socket);
  } catch (err) {
    if (err === 'jwt expired') {
      socket.emit('error', 'Токен авторизации отсутствует.');
      return socket.disconnect(true);
    }

    socket.emit('error', ERROR_MESSAGE);
    return socket.disconnect(true);
  }
};
