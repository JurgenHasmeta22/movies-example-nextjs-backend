import express from 'express';
import genreController from '../controllers/genre.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { genreSchemaPost, genreSchemaUpdate, genreQuerySchema } from '../schemas/genre.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/genres', genreQuerySchema, validateMiddleware, genreController.getGenres);
router.get('/genres/:id', genreController.getGenreById);
router.get('/genres/:name', genreController.getGenreByName);
router.delete('/genres/:id', genreController.deleteGenreById);
router.put('/genres/:id', genreSchemaPost, validateMiddleware, genreController.updateGenreById);
router.patch('/genres/:id', genreSchemaUpdate, validateMiddleware, genreController.updateGenreById);
router.post('/genres', genreSchemaPost, validateMiddleware, genreController.addGenre);
router.get('/searchGenres', genreController.searchGenresByName);

export default router;
