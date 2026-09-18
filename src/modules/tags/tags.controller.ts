import { RequestHandler } from 'express';
import { getTags } from './tags.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';

export const getTagsController: RequestHandler = async (req, res) => {
  const search = req.query.search;
  const trueSearch = search && typeof search === 'string' ? search : '';

  try {
    const tags = await getTags(trueSearch);

    CustomResponse(res, {
      data: {
        tags: tags,
      },
    });
  } catch (error) {
    CustomError(res, { logger: error });
  }
};
