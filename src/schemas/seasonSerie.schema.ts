import { body } from 'express-validator';

const seasonSerieSchema = [body('serieId').isInt({ min: 1 }), body('seasonId').isInt({ min: 1 })];

export { seasonSerieSchema };