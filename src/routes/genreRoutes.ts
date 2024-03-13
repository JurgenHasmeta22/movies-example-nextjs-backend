import express from 'express';
import { validateGenre } from '../middlewares/validateGenre';
import { genreSchemaUpdate, genreSchemaPost } from '../schemas/genreSchema';

const router = express.Router();

export default router;