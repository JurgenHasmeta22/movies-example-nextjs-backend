import { body } from 'express-validator';

const serieSchemaUpdate = [
    body('title').optional().isString(),
    body('photoSrc').optional().isString(),
    body('releaseYear').optional().isNumeric(),
    body('ratingImdb').optional().isNumeric(),
];

const serieSchemaPost = [
    body('title').isString(),
    body('photoSrc').isString(),
    body('releaseYear').isNumeric(),
    body('ratingImdb').isNumeric(),
];

export { serieSchemaPost, serieSchemaUpdate };
