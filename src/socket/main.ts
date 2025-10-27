import { getSession } from '@/db/sessions';
import { TTokenBody } from '@/models/token';
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
    const payload = getTokenPayload<TTokenBody>(token);
    const session = await getSession(payload.userID, payload.sessionID);
    if (!session) {
      socket.emit('error', 'Сессия отсутствует.');
      return socket.disconnect(true);
    }

    const data = await verifyToken<TTokenBody>(token);

    if (data) {
      return;
    }

    socketConnectionHandler(io, socket);
  } catch (err) {
    if (err === 'jwt expired') {
      socket.emit('error', 'Токен авторизации отсутствует.');
      return socket.disconnect(true);
    }

    socket.emit('error');
    return socket.disconnect(true);
  }
};
