import { Router } from 'express';
import { authenticate } from '@/middleware/authenticate.js';
import {
  GetMyProfileController,
  GetProfileController,
  GetProfileStoriesController,
} from '@/modules/profiles/profile.controller.js';

const router = Router();

router.get('/', authenticate, GetMyProfileController);
router.get('/:profileID', authenticate, GetProfileController);
router.get('/:profileID/stories', authenticate, GetProfileStoriesController);

export { router as profilesRouter };
