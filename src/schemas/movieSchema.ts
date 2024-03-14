import { body } from 'express-validator';

const movieSchemaUpdate = [
    body('title').optional().isString(),
    body('videoSrc').optional().isString(),
    body('photoSrc').optional().isURL(),
    body('trailerSrc').optional().isURL(),
    body('duration').optional().isString().isLength({ min: 1, max: 3 }),
    body('ratingImdb').optional().isFloat({ min: 0, max: 10 }),
    body('releaseYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
    body('description').optional().isString().isLength({ min: 10, max: 200 }),
    body('views').optional().isInt({ min: 0 }),
];

const movieSchemaPost = [
    body('title').isString(),
    body('videoSrc').isString(),
    body('photoSrc').isURL(),
    body('trailerSrc').isURL(),
    body('duration').isString().isLength({ min: 1, max: 3 }),
    body('ratingImdb').isFloat({ min: 0, max: 10 }),
    body('releaseYear').isInt({ min: 1900, max: new Date().getFullYear() }),
    body('description').isString().isLength({ min: 10, max: 200 }),
    body('views').isInt({ min: 0 }),
];

export { movieSchemaPost, movieSchemaUpdate };
