import express from 'express';
import { validateSerie } from '../middlewares/validateSerie';
import { serieSchemaUpdate, serieSchemaPost } from '../schemas/serieSchema';

const router = express.Router();

export default router;
