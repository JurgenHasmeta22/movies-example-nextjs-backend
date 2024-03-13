import express from 'express';
import { validateEpisode } from '../middlewares/validateEpisode';
import { episodeSchemaUpdate, episodeSchemaPost } from '../schemas/episodeSchema';

const router = express.Router();

export default router;