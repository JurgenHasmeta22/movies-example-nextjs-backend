import { body } from 'express-validator';

const favoriteSchema = [
    body('userId').optional().isInt({ min: 1 }),
    body('movieId').optional().isInt({ min: 1 }),
];

export { favoriteSchema };