import { body } from 'express-validator';

const userGenreSchema = [body('userId').isInt({ min: 1 }), body('genreId').isInt({ min: 1 })];

export { userGenreSchema };
