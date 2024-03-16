import express from 'express';
import genreController from '../controllers/genre.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import {
    genreSchemaPost,
    genreSchemaUpdate,
    genreQuerySchema,
    genreIdParamSchema,
    genreNameParamSchema,
} from '../schemas/genre.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/genres', genreQuerySchema, validateMiddleware, genreController.getGenres);
router.get('/genres/:id', genreIdParamSchema, validateMiddleware, genreController.getGenreById);
router.get('/genres/:name', genreNameParamSchema, validateMiddleware, genreController.getGenreByName);
router.delete('/genres/:id', genreIdParamSchema, validateMiddleware, genreController.deleteGenreById);
router.put('/genres/:id', genreIdParamSchema, genreSchemaPost, validateMiddleware, genreController.updateGenreById);
router.patch('/genres/:id', genreIdParamSchema, genreSchemaUpdate, validateMiddleware, genreController.updateGenreById);
router.post('/genres', genreSchemaPost, validateMiddleware, genreController.addGenre);
router.get('/searchGenres', genreController.searchGenresByName);

export default router;
