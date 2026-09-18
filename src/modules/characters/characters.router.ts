import {
  СreateCharacterController,
  deleteCharacterController,
  getCharacterByIDController,
  getShortCharactersByUserIDController,
  updateCharacterController,
} from '@/modules/characters/characters.controller.js';
import { authenticate } from '@/middleware/authenticate.js';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, getShortCharactersByUserIDController);
router.post('/', authenticate, СreateCharacterController);
router.get('/:characterID', authenticate, getCharacterByIDController);
router.delete('/:characterID', authenticate, deleteCharacterController);
router.put('/:characterID', authenticate, updateCharacterController);

export { router as charactersRouter };
