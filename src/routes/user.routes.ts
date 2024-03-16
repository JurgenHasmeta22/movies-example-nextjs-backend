import express from 'express';
import userController from '../controllers/user.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { userSchemaUpdate, userSchemaPost, userQuerySchema } from '../schemas/user.schema';
import { authMiddleware } from '../middlewares/auth.middleware';
import { userSeasonSchema } from '../schemas/userSeason.schema';
import { userMovieSchema } from '../schemas/userMovie.schema';
import { userEpisodeSchema } from '../schemas/userEpisode.schema';
import { userGenreSchema } from '../schemas/userGenre.schema';

const router = express.Router();

router.use(authMiddleware);

router.get('/users', userQuerySchema, validateMiddleware, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/:title', userController.getUserByTitle);
router.delete('/users/:id', userController.deleteUserById);
router.patch('/users/:id', userSchemaUpdate, validateMiddleware, userController.updateUserById);
router.put('/users/:id', userSchemaPost, validateMiddleware, userController.updateUserById);
router.get('/searchUsers', userController.searchUsersByTitle);
router.post('/addSeasonToUser', userSeasonSchema, validateMiddleware, userController.addSeasonToUser);
router.post('/addMovieToUser', userMovieSchema, userController.addMovieToUser);
router.post('/addSerieToUser', userEpisodeSchema, validateMiddleware, userController.addSerieToUser);
router.post('/addEpisodeToUser', userSeasonSchema, validateMiddleware, userController.addEpisodeToUser);
router.post('/addGenreToUser', userGenreSchema, validateMiddleware, userController.addGenreToUser);

export default router;
