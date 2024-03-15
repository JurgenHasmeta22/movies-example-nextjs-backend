import express from 'express';
import {  validateMiddleware } from '../middlewares/validate.middleware';
import { episodeSchemaUpdate, episodeSchemaPost } from '../schemas/episode.schema';

const router = express.Router();

export default router;