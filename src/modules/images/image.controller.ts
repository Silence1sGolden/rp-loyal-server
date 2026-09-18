import { RequestHandler } from 'express';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { CreateImage } from '@/modules/images/images.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';
import path from 'path';
import { uploadDir } from './images.routes.js';
import { withTransaction } from '@/utils/service.js';
import { db } from '@/db.js';

export const CreateImageController: RequestHandler = async (req, res) => {
  if (!req.file) {
    return CustomError(res, { code: 400 });
  }

  const filename = `${randomUUID()}.webp`;
  const finalPath = path.join(uploadDir, filename);
  const urlToFile = `/uploads/${filename}`;

  try {
    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(finalPath);

    const result = await withTransaction(db, (conn) =>
      CreateImage(conn, filename, urlToFile),
    );

    if (!result) {
      throw new Error('Failed to create image: no insertId generated');
    }

    CustomResponse(res, { code: 200, data: { id: result, url: urlToFile } });
  } catch (error) {
    CustomError(res, {
      code: 500,
      logger: error,
    });
  }
};
