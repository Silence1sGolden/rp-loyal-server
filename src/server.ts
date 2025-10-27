import { Server, Socket } from 'socket.io';
import { app } from './app';
import dotenv from 'dotenv';
import { socketAuthHandler } from './socket/main';
import { clearExpiredCodes } from './db/codes';

dotenv.config();

const PORT = process.env.PORT || '3000';
const server = app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});

const io = new Server(server);

const onConnection = (socket: Socket) => {
  socketAuthHandler(io, socket);
};

io.on('connection', onConnection);

setInterval(() => {
  clearExpiredCodes();
}, 60 * 1000);
