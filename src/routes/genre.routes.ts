import express from 'express';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { genreSchemaUpdate, genreSchemaPost } from '../schemas/genre.schema';

const router = express.Router();

export default router;
