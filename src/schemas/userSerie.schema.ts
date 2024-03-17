import { body } from 'express-validator';

const userSerieSchema = [body('userId').isInt({ min: 1 }), body('serieId').isInt({ min: 1 })];

export { userSerieSchema };
