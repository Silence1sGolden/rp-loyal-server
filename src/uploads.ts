import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) return cb(null, true);
  cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif, webp)'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Увеличим лимит до 10МБ, так как sharp все равно сожмет файл
});
