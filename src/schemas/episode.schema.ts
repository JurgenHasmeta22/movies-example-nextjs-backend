import { body } from 'express-validator';

const episodeSchemaUpdate = [
    body('title').optional().isString(),
    body('photoSrc').optional().isString(),
    body('videoSrc').optional().isString(),
    body('description').optional().isString(),
    body('serieId').optional().isNumeric(),
];

const episodeSchemaPost = [
    body('title').isString(),
    body('photoSrc').isString(),
    body('videoSrc').isString(),
    body('description').isString(),
    body('serieId').isNumeric(),
];

export { episodeSchemaPost, episodeSchemaUpdate };
