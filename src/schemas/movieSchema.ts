import { body } from 'express-validator';

const movieSchemaUpdate = [
    body('title').optional().isString(),
    body('videoSrc').optional().isString(),
    body('photoSrc').optional().isString(),
    body('trailerSrc').optional().isString(),
    body('duration').optional().isString(),
    body('ratingImdb').optional().isNumeric(),
    body('releaseYear').optional().isNumeric(),
    body('description').optional().isString(),
    body('views').optional().isNumeric(),
];

const movieSchemaPost = [
    body('title').isString(),
    body('videoSrc').isString(),
    body('photoSrc').isString(),
    body('trailerSrc').isString(),
    body('duration').isString(),
    body('ratingImdb').isNumeric(),
    body('releaseYear').isNumeric(),
    body('description').isString(),
    body('views').isNumeric(),
];

export { movieSchemaPost, movieSchemaUpdate };
