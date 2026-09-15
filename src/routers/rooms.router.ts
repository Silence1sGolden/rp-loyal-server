import { roomsController } from '@/controllers/rooms/rooms.controller.js';
import { authCheck } from '@/middleware/users/auth.check.js';
import { Router } from 'express';

const router = Router();

router.get('/', authCheck, roomsController);

export { router as roomsRouter };
