import express from 'express';
import movieController from '../controllers/movie.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import {
    movieSchemaUpdate,
    movieSchemaPost,
    movieQuerySchema,
    movieIdParamSchema,
    movieTitleParamSchema,
} from '../schemas/movie.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/movies', movieQuerySchema, validateMiddleware, movieController.getMovies);
router.get('/getMovieById/:id', movieIdParamSchema, validateMiddleware, movieController.getMovieById);
router.get('/getMovieByTitle/:title', movieTitleParamSchema, validateMiddleware, movieController.getMovieByTitle);
router.delete('/movies/:id', movieIdParamSchema, validateMiddleware, movieController.deleteMovieById);
router.patch('/movies/:id', movieIdParamSchema, movieSchemaUpdate, validateMiddleware, movieController.updateMovieById);
router.put('/movies/:id', movieIdParamSchema, movieSchemaPost, validateMiddleware, movieController.updateMovieById);
router.post('/movies', movieSchemaPost, validateMiddleware, movieController.addMovie);
router.get('/searchMovies', movieController.searchMoviesByTitle);
router.get('/latestMovies', movieController.getLatestMovies);

export default router;
