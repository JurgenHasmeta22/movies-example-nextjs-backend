import express from 'express';
import episodeController from '../controllers/episode.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import {
    episodeSchemaUpdate,
    episodeSchemaPost,
    episodeQuerySchema,
    episodeIdParamSchema,
    episodeTitleParamSchema,
} from '../schemas/episode.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/episodes', episodeQuerySchema, validateMiddleware, episodeController.getEpisodes);
router.get('/episodes/:id', episodeIdParamSchema, validateMiddleware, episodeController.getEpisodeById);
router.get('/episodes/:title', episodeTitleParamSchema, validateMiddleware, episodeController.getEpisodeByTitle);
router.delete('/episodes/:id', episodeIdParamSchema, validateMiddleware, episodeController.deleteEpisodeById);
router.patch(
    '/episodes/:id',
    episodeIdParamSchema,
    episodeSchemaUpdate,
    validateMiddleware,
    episodeController.updateEpisodeById,
);
router.put(
    '/episodes/:id',
    episodeIdParamSchema,
    episodeSchemaPost,
    validateMiddleware,
    episodeController.updateEpisodeById,
);
router.post('/episodes', episodeSchemaPost, validateMiddleware, episodeController.addEpisode);
router.get('/searchEpisodes', episodeController.searchEpisodesByTitle);

export default router;
