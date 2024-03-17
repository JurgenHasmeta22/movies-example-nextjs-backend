import { body } from 'express-validator';

const userEpisodeSchema = [body('userId').isInt({ min: 1 }), body('episodeId').isInt({ min: 1 })];

export { userEpisodeSchema };
