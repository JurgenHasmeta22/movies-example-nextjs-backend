import express from 'express';
import serieController from '../controllers/serie.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { serieSchemaUpdate, serieSchemaPost, serieQuerySchema } from '../schemas/serie.schema';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/series', serieQuerySchema, validateMiddleware, serieController.getSeries);
router.get('/series/:id', serieController.getSerieById);
router.get('/series/:title', serieController.getSerieByTitle);
router.delete('/series/:id', serieController.deleteSerieById);
router.patch('/series/:id', serieSchemaUpdate, validateMiddleware, serieController.updateSerieById);
router.post('/series', serieSchemaPost, validateMiddleware, serieController.addSerie);
router.get('/searchSeries', serieController.searchSeriesByTitle);
// router.get('/latestSeries', serieController.getLatestSeries);
// router.post('/favoritesSeries', favoriteSchema, validateMiddleware, serieController.addFavoriteSerieByUser);
router.put('/series/:id', serieSchemaPost, validateMiddleware, serieController.updateSerieById);

export default router;
