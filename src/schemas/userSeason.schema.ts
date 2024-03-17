import { body } from 'express-validator';

const userSeasonSchema = [body('userId').isInt({ min: 1 }), body('seasonId').isInt({ min: 1 })];

export { userSeasonSchema };
