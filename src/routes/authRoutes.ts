import express from 'express';
import authController from '../controllers/authController';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { loginSchema, registerSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/register', registerSchema, validateMiddleware, authController.signUp);
router.post('/login', loginSchema, validateMiddleware, authController.login);
router.get('/validateUser', authController.validate);

export default router;
