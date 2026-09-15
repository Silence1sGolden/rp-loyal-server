import {
  getStories,
  getStoriesByUserID,
  getStoryByID,
} from '@/services/stories.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';

export const getStoriesController: RequestHandler = async (req, res) => {
  const { offset } = req.query;

  try {
    const stories = await getStories();

    CustomResponse(res, {
      data: {
        stories: stories,
      },
    });
  } catch (error) {
    CustomError(res, { logger: error });
  }
};

export const getUserStoriesController: RequestHandler = async (req, res) => {
  const userID = +res.locals.userID;
  const profileID = +req.params.profileID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (!profileID || isNaN(profileID) || isNaN(userID)) {
    return CustomError(res, { code: 400 });
  }

  if (userID !== profileID) {
    return CustomError(res, { code: 403 });
  }

  try {
    const stories = await getStoriesByUserID(profileID);

    CustomResponse(res, {
      data: {
        stories: stories,
      },
    });
  } catch (error) {
    CustomError(res, { logger: error });
  }
};

export const getStoryController: RequestHandler = async (req, res) => {
  const storyID = +req.params.storyID;
  const userID = +res.locals.userID;

  if (!storyID || isNaN(storyID) || isNaN(userID)) {
    return CustomError(res, { code: 400 });
  }

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  try {
    const story = await getStoryByID(storyID);

    if (!story) {
      return CustomError(res, { code: 404 });
    }

    const permissions = story.author.id === userID ? 'owner' : 'viewer';

    CustomResponse(res, {
      data: {
        story: story,
        permissions: permissions,
      },
    });
  } catch (error) {
    CustomError(res, { logger: error });
  }
};
