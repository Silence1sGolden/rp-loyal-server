import { Router } from 'express';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { REQUESTS } from '@/utils/mock/index.js';
import { authCheck } from '@/middleware/users/auth.check.js';

const router = Router({ mergeParams: true });

let REQ = [...REQUESTS];

router.get('/', authCheck, async (req, res) => {
  const storyID = req.params.storyID;
  const userID: string | undefined = res.locals.userID;

  if (!storyID || !userID) {
    return CustomError(res, { code: 400 });
  }

  return CustomResponse(res, {
    data: {
      applications: REQ,
    },
  });
});

router.post('/:applicationID/decision', authCheck, async (req, res) => {
  const { applicationID } = req.params;
  const body = req.body;

  if (!body.decision || !applicationID) {
    return CustomError(res, { code: 400 });
  }

  REQ = REQ.filter((i) => i.id !== applicationID);

  return CustomResponse(res);
});

export { router as applicationRoute };
