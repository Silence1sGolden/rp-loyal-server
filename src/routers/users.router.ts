import { Router } from 'express';
import { authValidate } from '@/services/users/auth.validate.js';
import { regValidate } from '@/services/users/register.validate.js';
import { codeValidate } from '@/services/mail/code.validate.js';
import { authController } from '@/controllers/users/auth.controller.js';
import { linkValidate } from '@/services/mail/link.validate.js';
import { registerController } from '@/controllers/users/register.controller.js';
import { authCheck } from '@/middleware/users/auth.check.js';
import { getUser } from '@/controllers/users/user.controller.js';

const router = Router();

router.post('/auth', authValidate);
router.post('/register', regValidate);

router.post('/verify/code', codeValidate, authController);
router.get('/verify/:jwtlink', linkValidate, registerController);

router.get('/profile', authCheck, getUser);

export { router as usersRouter };
