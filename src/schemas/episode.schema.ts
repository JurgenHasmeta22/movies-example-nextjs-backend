import { body, query } from 'express-validator';

const allowedSortByProperties = ['id', 'title', 'photoSrc', 'videoSrc', 'description'];

const episodeQuerySchema = [
    query('sortBy')
        .optional()
        .custom((value) => {
            if (!value) return true;

            if (!allowedSortByProperties.includes(value)) {
                throw new Error('Invalid sortBy value');
            }

            return true;
        }),
    query('ascOrDesc').optional().isIn(['asc', 'desc']).withMessage('Invalid ascOrDesc value'),
    query('page').optional().isInt({ min: 1 }).withMessage('Invalid page value'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid pageSize value'),
    query('title').optional().isString().withMessage('Title must be a string'),
    query('filterValue').optional().isString().withMessage('Filter value must be a string'),
    query('filterName').optional().isIn(['title', 'releaseYear']).withMessage('Invalid filterName value'),
    query('filterOperator')
        .optional()
        .isIn(['equals', 'contains', 'startsWith', 'endsWith'])
        .withMessage('Invalid filterOperator value'),
];

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

export { episodeSchemaPost, episodeSchemaUpdate, episodeQuerySchema };
