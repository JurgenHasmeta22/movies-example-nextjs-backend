import express from 'express';
import userController from '../controllers/user.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { userSchemaUpdate, userSchemaPost, userQuerySchema } from '../schemas/user.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/users', userQuerySchema, validateMiddleware, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/:title', userController.getUserByTitle);
router.delete('/users/:id', userController.deleteUserById);
router.patch('/users/:id', userSchemaUpdate, validateMiddleware, userController.updateUserById);
router.get('/searchUsers', userController.searchUsersByTitle);
router.post('/addSeasonToUser', validateMiddleware, userController.addSeasonToUser);
router.put('/users/:id', userSchemaPost, validateMiddleware, userController.updateUserById);

export default router;
