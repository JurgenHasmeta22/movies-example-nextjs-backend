import express from 'express';
import serieController from '../controllers/serie.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { serieSchemaUpdate, serieSchemaPost, serieQuerySchema } from '../schemas/serie.schema';
import { authMiddleware } from '../middlewares/auth.middleware';
import { seasonSerieSchema } from '../schemas/seasonSerie.schema';

const router = express.Router();

router.use(authMiddleware);

router.get('/series', serieQuerySchema, validateMiddleware, serieController.getSeries);
router.get('/series/:id', serieController.getSerieById);
router.get('/series/:title', serieController.getSerieByTitle);
router.delete('/series/:id', serieController.deleteSerieById);
router.patch('/series/:id', serieSchemaUpdate, validateMiddleware, serieController.updateSerieById);
router.put('/series/:id', serieSchemaPost, validateMiddleware, serieController.updateSerieById);
router.post('/series', serieSchemaPost, validateMiddleware, serieController.addSerie);
router.get('/searchSeries', serieController.searchSeriesByTitle);
router.get('/latestSeries', serieController.getLatestSeries);
router.post('/addSeasonToSerie', seasonSerieSchema, validateMiddleware, serieController.addSeasonToSerie);

export default router;
