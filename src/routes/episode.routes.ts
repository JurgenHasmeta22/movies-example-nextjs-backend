import express from 'express';
import episodeController from '../controllers/episode.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { episodeSchemaUpdate, episodeSchemaPost, episodeQuerySchema } from '../schemas/episode.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/episodes', episodeQuerySchema, validateMiddleware, episodeController.getEpisodes);
router.get('/episodes/:id', episodeController.getEpisodeById);
router.get('/episodes/:title', episodeController.getEpisodeByTitle);
router.delete('/episodes/:id', episodeController.deleteEpisodeById);
router.patch('/episodes/:id', episodeSchemaUpdate, validateMiddleware, episodeController.updateEpisodeById);
router.put('/episodes/:id', episodeSchemaPost, validateMiddleware, episodeController.updateEpisodeById);
router.post('/episodes', episodeSchemaPost, validateMiddleware, episodeController.addEpisode);
router.get('/searchEpisodes', episodeController.searchEpisodesByTitle);

export default router;
