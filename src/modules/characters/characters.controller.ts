import {
  CreateCharacter,
  deleteCharacter,
  getCharacterByID,
  getShortCharactersByUserID,
  updateCharacter,
} from '@/modules/characters/characters.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import { RequestHandler } from 'express';
import {
  CharacterIDParamsSchema,
  CharactersSchema,
} from './characters.schema.js';
import { UserIDLocalsSchema } from '@/utils/schema/user.schema.js';
import { db } from '@/db.js';
import { getAuthorByUserID } from '@/modules/profiles/author.service.js';
import { GetImageByID } from '../images/images.service.js';

export const getShortCharactersByUserIDController: RequestHandler = async (
  _,
  res,
) => {
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!locals.success) {
    return CustomError(res, { code: 400, error: locals.error.message });
  }

  try {
    const characters = await getShortCharactersByUserID(db, locals.data.userID);

    return CustomResponse(res, {
      data: {
        characters: characters,
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const СreateCharacterController: RequestHandler = async (req, res) => {
  const body = CharactersSchema.safeParse(req.body);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!body.success || !locals.success) {
    return CustomError(res, {
      code: 400,
      error: body.error?.message || locals.error?.message,
    });
  }

  try {
    const result = await CreateCharacter(db, locals.data.userID, body.data);

    if (!result) {
      throw new Error('Failed to create session: no insertId generated');
    }

    return CustomResponse(res);
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const getCharacterByIDController: RequestHandler = async (req, res) => {
  const params = CharacterIDParamsSchema.safeParse(req.params);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!params.success || !locals.success) {
    return CustomError(res, {
      code: 400,
      error: params.error?.message || locals.error?.message,
    });
  }

  try {
    const character = await getCharacterByID(db, params.data.characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    const image = character.avatar_id
      ? await GetImageByID(db, character.avatar_id)
      : null;
    const avatar = image ? image.path : null;
    const author = await getAuthorByUserID(db, character.author_id);

    const { author_id, avatar_id, ...clearCharacter } = character;

    return CustomResponse(res, {
      data: {
        character: {
          ...clearCharacter,
          author,
          avatar,
        },
        permissions: author?.id === locals.data.userID ? 'owner' : 'viewer',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const deleteCharacterController: RequestHandler = async (req, res) => {
  const params = CharacterIDParamsSchema.safeParse(req.params);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!params.success || !locals.success) {
    return CustomError(res, {
      code: 400,
      error: params.error?.message || locals.error?.message,
    });
  }

  try {
    const character = await getCharacterByID(db, params.data.characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    if (character.author_id !== locals.data.userID) {
      return CustomError(res, { code: 403 });
    }

    const result = await deleteCharacter(db, params.data.characterID);

    if (!result) {
      throw new Error('Failed to delete character: 0 affected rows');
    }

    return CustomResponse(res, {
      data: {
        message: 'OK',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};

export const updateCharacterController: RequestHandler = async (req, res) => {
  const body = CharactersSchema.safeParse(req.body);
  const params = CharacterIDParamsSchema.safeParse(req.params);
  const locals = UserIDLocalsSchema.safeParse(res.locals);

  if (!params.success || !locals.success || !body.success) {
    return CustomError(res, {
      code: 400,
      error:
        params.error?.message || locals.error?.message || body.error?.message,
    });
  }

  try {
    const character = await getCharacterByID(db, params.data.characterID);

    if (!character) {
      return CustomError(res, { code: 404 });
    }

    if (character.author_id !== locals.data.userID) {
      return CustomError(res, { code: 403 });
    }

    const result = await updateCharacter(
      db,
      params.data.characterID,
      body.data,
    );

    if (!result) {
      throw new Error('Failed to update character: 0 affected rows');
    }

    return CustomResponse(res, {
      data: {
        message: 'OK',
      },
    });
  } catch (error) {
    return CustomError(res, { logger: error });
  }
};
