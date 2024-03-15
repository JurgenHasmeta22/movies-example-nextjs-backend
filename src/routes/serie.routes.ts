import express from 'express';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { serieSchemaUpdate, serieSchemaPost } from '../schemas/serie.schema';

const router = express.Router();

export default router;
