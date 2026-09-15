import { Router } from 'express';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { REQUESTS, STORIES } from '@/utils/mock/index.js';
import { authCheck } from '@/middleware/users/auth.check.js';
import { EditableStoryParams } from '@/models/stories.js';
import { applicationRoute } from './applications.router.js';
import { checkFields } from '@/utils/service.js';
import { createStory } from '@/services/stories/create.js';
import {
  getStoriesController,
  getStoryController,
} from '@/controllers/stories/stories.controller.js';

const router = Router();

router.get('/', getStoriesController);

router.post('/', authCheck, async (req, res) => {
  const body: EditableStoryParams = req.body;
  const { userID } = res.locals;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (checkFields(body, ['title', 'play_type', 'play_style'])) {
    return CustomError(res, { code: 400 });
  }

  try {
    const create = await createStory(userID, body);

    if (!create) {
      return CustomError(res);
    }

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { logger: error });
  }
});

router.use('/:storyID/applications', applicationRoute);
router.get('/:storyID', authCheck, getStoryController);

router.delete('/:storyID', authCheck, async (req, res) => {
  const storyID = req.params.storyID;
  const userID: string = res.locals.userID;

  if (!storyID) {
    return CustomError(res, { code: 400 });
  }

  const targetStory = STORIES.find((i) => i.id === +storyID);

  if (!targetStory) {
    return CustomError(res, { code: 404 });
  }

  const permissions = targetStory.author?.id === +userID ? 'owner' : 'viewer';

  return CustomResponse(res, {
    data: {
      story: targetStory,
      requests: permissions === 'owner' ? REQUESTS : undefined,
      permissions: permissions,
    },
  });
});

export { router as storiesRouter };
