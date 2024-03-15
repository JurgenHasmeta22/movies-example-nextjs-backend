import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { genreSchemaUpdate, genreSchemaPost } from '../schemas/genre.schema';

const router = express.Router();

export default router;