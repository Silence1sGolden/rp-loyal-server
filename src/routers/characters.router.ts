import { authCheck } from '@/middleware/users/auth.check.js';
import { CharacterEditableParams } from '@/models/characters.js';
import {
  createCharacter,
  deleteCharacter,
  getCharacterByID,
  getShortCharactersByUserID,
  updateCharacter,
} from '@/services/characters.service.js';
import { getProfileByUserID } from '@/services/profiles.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { checkFields } from '@/utils/service.js';
import { Router } from 'express';

const router = Router();

router.get('/', authCheck, async (_, res) => {
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  try {
    const characters = await getShortCharactersByUserID(userID);

    return CustomResponse(res, {
      data: {
        characters: characters,
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
});

router.post('/', authCheck, async (req, res) => {
  const body: CharacterEditableParams = req.body;
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (checkFields(body, ['first_name'])) {
    return CustomError(res, { code: 400 });
  }

  try {
    const characters = await createCharacter(userID, body);

    if (!characters) {
      return CustomError(res);
    }

    return CustomResponse(res);
  } catch (error) {
    return CustomError(res, { logger: error });
  }
});

router.get('/:characterID', authCheck, async (req, res) => {
  const { characterID } = req.params;
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (!characterID || typeof characterID !== 'string') {
    return CustomError(res, { code: 400 });
  }

  try {
    const character = await getCharacterByID(+characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    const author = await getProfileByUserID(character.author_id);

    return CustomResponse(res, {
      data: {
        character: { ...character, author: author },
        permissions: author?.id === userID ? 'owner' : 'viewer',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
});

router.delete('/:characterID', authCheck, async (req, res) => {
  const { characterID } = req.params;
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (!characterID || typeof characterID !== 'string') {
    return CustomError(res, { code: 400 });
  }

  try {
    const character = await getCharacterByID(+characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    if (character.author_id !== userID) {
      return CustomError(res, { code: 403 });
    }

    const deletion = await deleteCharacter(characterID);

    if (!deletion) {
      return CustomError(res);
    }

    return CustomResponse(res, {
      data: {
        message: 'OK',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
});

router.put('/:characterID', authCheck, async (req, res) => {
  const body: CharacterEditableParams = req.body;
  const { characterID } = req.params;
  const userID = res.locals.userID;

  if (!userID) {
    return CustomError(res, { code: 401 });
  }

  if (!characterID || typeof characterID !== 'string') {
    return CustomError(res, { code: 400 });
  }

  try {
    const character = await getCharacterByID(+characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    if (character.author_id !== userID) {
      return CustomError(res, { code: 403 });
    }

    const update = await updateCharacter(characterID, {
      ...character,
      ...body,
    });

    if (!update) {
      return CustomError(res);
    }

    return CustomResponse(res, {
      data: {
        message: 'OK',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
});

export { router as charactersRouter };
