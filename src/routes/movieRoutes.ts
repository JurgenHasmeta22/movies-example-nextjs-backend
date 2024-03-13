import express from 'express';
import movieController from '../controllers/movieController';

const router = express.Router();

router.get('/movies/page/:pagenr', movieController.getMoviesByPage);
router.get('/movies', movieController.getMovies);
router.get('/moviesNoPagination/:id', movieController.getMovieNoPaginationById);
router.get('/movie/:title', movieController.getMovieByTitle);
router.get('/movies-count', movieController.getMoviesCount);
router.get('/latest', movieController.getLatestMovies);
router.get('/favorites', movieController.getFavoritesMoviesByUser);
router.post('/favorites', movieController.addFavoriteMovieByUser);
router.delete('/movies/:id', movieController.deleteMovie);
router.post('/searchMovies', movieController.searchMovies);

export default router;