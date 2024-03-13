import express from 'express';
import {  validateMiddleware } from '../middlewares/validateMiddleware';
import { episodeSchemaUpdate, episodeSchemaPost } from '../schemas/episodeSchema';

const router = express.Router();

export default router;