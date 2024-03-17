import { body } from 'express-validator';

const userMovieSchema = [body('userId').isInt({ min: 1 }), body('movieId').isInt({ min: 1 })];

export { userMovieSchema };
