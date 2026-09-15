import { db } from '@/db.js';
import { Images } from '@/models/images.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createImage(filename: string, pathToFile: string) {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO images (filename, path) VALUES (?, ?)',
    [filename, pathToFile],
  );

  return result.insertId;
}

export async function getImageByID(image_id: number): Promise<Images | null> {
  const [images] = await db.execute<(Images & RowDataPacket)[]>(
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

export async function getImagesByIDs(image_ids: number[]): Promise<Images[]> {
  const [images] = await db.execute<(Images & RowDataPacket)[]>(
    `
      SELECT id,
             filename,
             path,
             created_at
      FROM images
      WHERE id IN (?)
    `,
    image_ids,
  );

  return images;
}
