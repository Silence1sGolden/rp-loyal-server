import { Router } from 'express';
import { authenticate } from '@/middleware/authenticate.js';
import { getTagsController } from './tags.controller.js';

const router = Router();

router.get('/', authenticate, getTagsController);

export { router as tagsRoute };
