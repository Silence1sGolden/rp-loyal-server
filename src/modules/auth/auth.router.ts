import { Router } from 'express';
import {
  VerifyCodeController,
  LoginController,
  VerifyAccountController,
  RegistrationController,
} from '@/modules/auth/auth.controller.js';

const router = Router();

router.post('/login', LoginController);
router.post('/register', RegistrationController);

router.post('/verify/code', VerifyCodeController);
router.get('/verify/:jwtlink', VerifyAccountController);

export { router as authRouter };
