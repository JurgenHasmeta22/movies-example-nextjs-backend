import express from 'express';
import movieController from '../controllers/movieController';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { movieSchemaUpdate, movieSchemaPost } from '../schemas/movieSchema';
import { favoriteSchema } from '../schemas/favoriteSchema';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getMovieById);
router.get('/movie/:title', movieController.getMovieByTitle);
router.delete('/movies/:id', movieController.deleteMovieById);
router.patch('/movies/:id', movieSchemaUpdate, validateMiddleware, movieController.updateMovieById);
router.post('/movies', movieSchemaPost, validateMiddleware, movieController.addMovie);
router.post('/searchMovies', movieController.searchMoviesByTitle);
router.get('/latestMovies', movieController.getLatestMovies);
router.get('/favoritesMovies', movieController.getFavoritesMoviesByUser);
router.post('/favoritesMovies', favoriteSchema, validateMiddleware, movieController.addFavoriteMovieByUser);

export default router;
