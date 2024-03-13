import express from 'express';
import movieController from '../controllers/movieController';

const router = express.Router();

router.get('/movies', movieController.getMovies);
router.get('/movies/:id', movieController.getMovieById);
router.get('/movie/:title', movieController.getMovieByTitle);
router.get('/latestMovies', movieController.getLatestMovies);
router.get('/favoritesMovies', movieController.getFavoritesMoviesByUser);
router.post('/favoritesMovies', movieController.addFavoriteMovieByUser);
router.delete('/movies/:id', movieController.deleteMovieById);
router.post('/searchMovies', movieController.searchMoviesByTitle);

export default router;
