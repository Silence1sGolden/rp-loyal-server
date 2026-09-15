import { upload } from '@/uploads.js';
import { Router } from 'express';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { createImage } from '@/services/images.service.js';
import { CustomError, CustomResponse } from '@/utils/response/index.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', upload.single('image'), async (req, res) => {
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

    const fileID = await createImage(filename, urlToFile);

    CustomResponse(res, { code: 200, data: { id: fileID, url: urlToFile } });
  } catch (error) {
    CustomError(res, {
      code: 500,
      logger: error,
    });
  }
});

export { router as imagesRouter };
