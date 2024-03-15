import express from 'express';
import {  validateMiddleware } from '../middlewares/validateMiddleware';
import { episodeSchemaUpdate, episodeSchemaPost } from '../schemas/episode.schema';

const router = express.Router();

export default router;