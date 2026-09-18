import { Router } from 'express';
import { authenticate } from '@/middleware/authenticate.js';
import {
  CreateStoryController,
  DeleteStoryController,
  getStoriesController,
  GetStoryController,
} from '@/modules/stories/stories.controller.js';
import {
  DecisionApplicaionController,
  GetStoryApplicationsController,
} from '@/modules/stories/applications.controller.js';

const router = Router();

router.get('/', getStoriesController);
router.post('/', authenticate, CreateStoryController);
router.get('/:storyID', authenticate, GetStoryController);
router.delete('/:storyID', authenticate, DeleteStoryController);
router.get(
  '/:storyID/applications',
  authenticate,
  GetStoryApplicationsController,
);
router.post(
  '/:storyID/applications/:applicationID/decision',
  authenticate,
  DecisionApplicaionController,
);

export { router as storiesRouter };
