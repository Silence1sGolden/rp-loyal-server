import { Router } from 'express';
import { authValidate } from '../services/users/auth.validate';
import { regValidate } from '@/services/users/register.validate';
import { codeValidate } from '@/controllers/mail/code.validate';
import { authController } from '@/controllers/users/auth.controller';

const router = Router();

// Открытые роуты (Публичные)
router.post('/auth', authValidate);
router.post('/register', regValidate);

// Роуты верификации (Вынесли в понятный под-путь)
// router.post('/verify/reg', regValidate);
router.post('/verify/code', codeValidate, authController);

export { router as usersRouter };
