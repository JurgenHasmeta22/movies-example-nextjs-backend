import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { serieSchemaUpdate, serieSchemaPost } from '../schemas/serieSchema';

const router = express.Router();

export default router;
