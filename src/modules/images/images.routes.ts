import { upload } from '@/uploads.js';
import { Router } from 'express';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { CreateImageController } from './image.controller.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', upload.single('image'), CreateImageController);

export { router as imagesRouter };
