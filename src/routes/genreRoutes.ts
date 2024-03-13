import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { genreSchemaUpdate, genreSchemaPost } from '../schemas/genreSchema';

const router = express.Router();

export default router;