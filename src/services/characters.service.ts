import { db } from '@/db.js';
import {
  Character,
  CharacterEditableParams,
  CharacterRow,
} from '@/models/characters.js';
import { ResultSetHeader } from 'mysql2';

export async function getCharacterByID(
  characterID: number,
): Promise<Character | null> {
  const [characters] = await db.execute<CharacterRow[]>(
    `
        SELECT characters.*,
               images.path as avatar
        FROM characters
        LEFT JOIN images ON images.id = characters.avatar_id
        WHERE characters.id = ?
        `,
    [characterID],
  );

  if (characters.length > 0) {
    return characters[0];
  }

  return null;
}

export async function getShortCharactersByUserID(
  user_id: number,
): Promise<Character[]> {
  const [characters] = await db.execute<CharacterRow[]>(
    `
        SELECT characters.id,
               characters.first_name,
               characters.second_name,
               images.path as avatar
        FROM characters
        LEFT JOIN images ON images.id = characters.avatar_id
        WHERE author_id = ?
        `,
    [user_id],
  );

  return characters;
}

export async function createCharacter(
  user_id: number,
  characterParams: CharacterEditableParams,
): Promise<boolean> {
  const {
    first_name,
    second_name,
    history,
    appearance,
    gender,
    age,
    avatar_id,
  } = characterParams;

  const [result] = await db.execute<ResultSetHeader>(
    `
        INSERT INTO characters (author_id, avatar_id, first_name, second_name, history, appearance, gender, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      avatar_id || 1,
      first_name,
      second_name || null,
      history || null,
      appearance || null,
      gender || null,
      age || null,
    ],
  );

  return result.affectedRows > 0;
}

export async function deleteCharacter(
  character_id: string | number,
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `
        DELETE
        FROM characters
        WHERE id = ?
    `,
    [character_id],
  );

  return result.affectedRows > 0;
}

export async function updateCharacter(
  character_id: string | number,
  characterParams: CharacterEditableParams,
): Promise<boolean> {
  const {
    first_name,
    second_name,
    history,
    appearance,
    gender,
    age,
    avatar_id,
  } = characterParams;

  const [result] = await db.execute<ResultSetHeader>(
    `
        UPDATE characters
        SET first_name = ?,
            second_name = ?,
            avatar_id = ?,
            history = ?,
            appearance = ?,
            gender = ?,
            age = ?
        WHERE id = ?
    `,
    [
      first_name,
      second_name || null,
      avatar_id || 1,
      history || null,
      appearance || null,
      gender || null,
      age || null,
      character_id,
    ],
  );

  return result.affectedRows > 0;
}
