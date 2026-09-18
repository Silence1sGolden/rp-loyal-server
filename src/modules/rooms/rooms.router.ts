import { roomsController } from '@/modules/rooms/rooms.controller.js';
import { authenticate } from '@/middleware/authenticate.js';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, roomsController);

export { router as roomsRouter };
