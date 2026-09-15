import { Router } from 'express';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { authCheck } from '@/middleware/users/auth.check.js';
import { getTags } from '@/services/tags/tags.service.js';

const router = Router();

router.get('/', authCheck, async (req, res) => {
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
});

export { router as tagsRoute };
