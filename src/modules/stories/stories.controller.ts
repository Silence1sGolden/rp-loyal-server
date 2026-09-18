import { db } from '@/db.js';
import {
  CreateStory,
  CreateStoryPlaystyle,
  CreateStoryTags,
  DeleteStoryByID,
  GetStories,
  getStoryByID,
} from '@/modules/stories/stories.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import {
  StoryBodySchema,
  StoryIDParamsSchema,
} from '@/modules/stories/stories.schema.js';
import { UserIDLocalsSchema } from '@/utils/schema/user.schema.js';
import { RequestHandler } from 'express';
import { withTransaction } from '@/utils/service.js';

export const getStoriesController: RequestHandler = async (_, res) => {
  // const { search } = req.query;

  try {
    const stories = await GetStories(db, {});

    CustomResponse(res, {
      data: {
        stories: stories,
      },
    });
  } catch (error) {
    CustomError(res, { logger: error });
  }
};

export const GetStoryController: RequestHandler = async (req, res) => {
  const locals = UserIDLocalsSchema.safeParse(res.locals);
  const params = StoryIDParamsSchema.safeParse(req.params);

  if (!locals.success || !params.success) {
    return CustomError(res, {
      code: 400,
      error: locals.error?.message || params.error?.message,
    });
  }

  try {
    const story = await getStoryByID(db, params.data.storyID);

    if (!story) {
      return CustomError(res, { code: 404 });
    }

    const permissions =
      story.author.id === locals.data.userID ? 'owner' : 'viewer';

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

export const DeleteStoryController: RequestHandler = async (req, res) => {
  const locals = UserIDLocalsSchema.safeParse(res.locals);
  const params = StoryIDParamsSchema.safeParse(req.params);

  if (!locals.success || !params.success) {
    return CustomError(res, {
      code: 400,
      error: locals.error?.message || params.error?.message,
    });
  }

  try {
    const story = await getStoryByID(db, params.data.storyID);

    if (!story) {
      return CustomError(res, { code: 404 });
    }

    if (story.author.id !== locals.data.userID) {
      return CustomError(res, { code: 403 });
    }

    const result = await DeleteStoryByID(db, params.data.storyID);

    if (!result) {
      return CustomError(res);
    }

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { logger: error });
  }
};

export const CreateStoryController: RequestHandler = async (req, res) => {
  const body = StoryBodySchema.safeParse(req.body);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!body.success || !locals.success) {
    return CustomError(res, {
      code: 400,
      error: body.error?.message || locals.error?.message,
    });
  }

  const { title, description, play_type, preview_id, tags, play_style } =
    body.data;

  try {
    const result = await withTransaction(db, async (conn) => {
      const storyID = await CreateStory(conn, locals.data.userID, {
        title,
        description,
        play_type,
        preview_id,
      });

      if (!storyID) {
        return 'Failed to create story: no insertId generated';
      }

      const slugs = tags.map((i) => i.slug);

      await CreateStoryTags(conn, storyID, slugs);
      await CreateStoryPlaystyle(conn, storyID, play_style);
    });

    if (result) {
      return CustomError(res, { code: 400, error: result });
    }

    CustomResponse(res);
  } catch (error) {
    CustomError(res, { logger: error });
  }
};
