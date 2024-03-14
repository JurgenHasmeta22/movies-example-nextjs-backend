import express from 'express';
import movieController from '../controllers/movieController';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { movieSchemaUpdate, movieSchemaPost, movieQuerySchema } from '../schemas/movieSchema';
import { favoriteSchema } from '../schemas/favoriteSchema';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/movies', movieQuerySchema, validateMiddleware, movieController.getMovies);
router.get('/movies/:id', movieController.getMovieById);
router.get('/movies/:title', movieController.getMovieByTitle);
router.delete('/movies/:id', movieController.deleteMovieById);
router.patch('/movies/:id', movieSchemaUpdate, validateMiddleware, movieController.updateMovieById);
router.post('/movies', movieSchemaPost, validateMiddleware, movieController.addMovie);
router.get('/searchMovies', movieController.searchMoviesByTitle);
router.get('/latestMovies', movieController.getLatestMovies);
router.post('/favoritesMovies', favoriteSchema, validateMiddleware, movieController.addFavoriteMovieByUser);
router.put('/movies/:id', movieSchemaPost, validateMiddleware, movieController.updateMovieById);

export default router;
