import { ImagesSchema } from '@/models/schemas/images.js';
import { Db } from '@/utils/service.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export async function CreateImage(
  conn: Db,
  filename: string,
  pathToFile: string,
) {
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO images (filename, path) VALUES (?, ?)',
    [filename, pathToFile],
  );

  return result.insertId;
}

export async function GetImageByID(
  conn: Db,
  image_id: number,
): Promise<ImagesSchema | null> {
  const [images] = await conn.execute<(ImagesSchema & RowDataPacket)[]>(
    `
      SELECT id,
             filename,
             path,
             created_at
      FROM images
      WHERE id = ?
    `,
    [image_id],
  );

  if (images.length) {
    return images[0];
  }

  return null;
}

export async function GetImagesByIDs(
  conn: Db,
  image_ids: number[],
): Promise<ImagesSchema[]> {
  const placeholder = Array.from({ length: image_ids.length })
    .map(() => '?')
    .join(', ');
  const [images] = await conn.execute<(ImagesSchema & RowDataPacket)[]>(
    `
      SELECT id,
             filename,
             path,
             created_at
      FROM images
      WHERE id IN (${placeholder})
    `,
    image_ids,
  );

  return images;
}
