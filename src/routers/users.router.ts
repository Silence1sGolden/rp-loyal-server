import { Router } from 'express';
import { authCheck } from '@/middleware/users/auth.check.js';
import {
  getMyProfileController,
  getProfileController,
} from '@/controllers/users/profile.controller.js';
import { getUserStoriesController } from '@/controllers/stories/stories.controller.js';

const router = Router();

router.get('/', authCheck, getMyProfileController);
router.get('/:profileID', authCheck, getProfileController);
router.get('/:profileID/stories', authCheck, getUserStoriesController);

export { router as profilesRouter };
