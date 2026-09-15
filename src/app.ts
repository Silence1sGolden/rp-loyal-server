import express from 'express';
import cors from 'cors';
import { authRouter } from './routers/auth.router.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import { roomsRouter } from './routers/rooms.router.js';
import { imagesRouter } from './routers/images.routes.js';
import { fileURLToPath } from 'url';
import { storiesRouter } from './routers/stories.routers.js';
import { charactersRouter } from './routers/characters.router.js';
import { profilesRouter } from './routers/users.router.js';
import { applicationRoute } from './routers/applications.router.js';
import { tagsRoute } from './routers/tags.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/v1', authRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/attach', imagesRouter);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/stories', storiesRouter);
// app.use('/api/v1/stories/:storyID/applications', applicationRoute);
app.use('/api/v1/characters', charactersRouter);
app.use('/api/v1/tags', tagsRoute);
