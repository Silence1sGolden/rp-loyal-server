import { CharactersSchema } from '@/models/schemas/characters.js';
import { Db } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function getCharacterByID(
  conn: Db,
  characterID: number,
): Promise<CharactersSchema | null> {
  const [characters] = await conn.execute<(CharactersSchema & RowDataPacket)[]>(
    `
      SELECT id,
              author_id,
              avatar_id,
              first_name,
              second_name,
              gender,
              age,
              appearance,
              history
      FROM characters
      WHERE id = ?
    `,
    [characterID],
  );

  if (characters.length > 0) {
    return characters[0];
  }

  return null;
}

export type GetShortCharactersByUserIDReturnType = Pick<
  CharactersSchema,
  'author_id' | 'first_name' | 'second_name' | 'avatar_id'
>;

export async function getShortCharactersByUserID(
  conn: Db,
  user_id: number,
): Promise<GetShortCharactersByUserIDReturnType[]> {
  const [characters] = await conn.execute<
    (GetShortCharactersByUserIDReturnType & RowDataPacket)[]
  >(
    `
      SELECT characters.id,
             characters.author_id,
             characters.first_name,
             characters.second_name,
             images.path AS avatar
      FROM characters
      LEFT JOIN images ON images.id = characters.avatar_id
      WHERE characters.author_id = ?
    `,
    [user_id],
  );

  return characters;
}

export async function CreateCharacter(
  conn: Db,
  user_id: number,
  characterParams: Omit<CharactersSchema, 'id' | 'author_id'>,
): Promise<number> {
  const {
    avatar_id,
    first_name,
    second_name,
    gender,
    age,
    appearance,
    history,
  } = characterParams;

  const [result] = await conn.execute<ResultSetHeader>(
    `
        INSERT INTO characters (author_id, avatar_id, first_name, second_name, history, appearance, gender, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      avatar_id,
      first_name,
      second_name,
      history,
      appearance,
      gender,
      age,
    ],
  );

  return result.insertId;
}

export async function deleteCharacter(
  conn: Db,
  character_id: number,
): Promise<boolean> {
  const [result] = await conn.execute<ResultSetHeader>(
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
  conn: Db,
  character_id: number,
  characterParams: Omit<CharactersSchema, 'id' | 'author_id'>,
): Promise<boolean> {
  const {
    avatar_id,
    first_name,
    second_name,
    gender,
    age,
    appearance,
    history,
  } = characterParams;

  const [result] = await conn.execute<ResultSetHeader>(
    `
        UPDATE characters
        SET avatar_id = ?,
            first_name = ?,
            second_name = ?,
            history = ?,
            appearance = ?,
            gender = ?,
            age = ?
        WHERE id = ?
    `,
    [
      avatar_id,
      first_name,
      second_name,
      history,
      appearance,
      gender,
      age,
      character_id,
    ],
  );

  return result.affectedRows > 0;
}
