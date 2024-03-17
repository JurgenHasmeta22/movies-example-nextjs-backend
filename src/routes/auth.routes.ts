import express from 'express';
import authController from '../controllers/auth.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerSchema, validateMiddleware, authController.signUp);
router.post('/login', loginSchema, validateMiddleware, authController.login);
router.get('/validateUser', authMiddleware, authController.validate);

export default router;
