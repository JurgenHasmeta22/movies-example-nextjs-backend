import { body, query } from 'express-validator';

const allowedSortByProperties = [
    'id',
    'title',
    'videoSrc',
    'photoSrc',
    'trailerSrc',
    'duration',
    'ratingImdb',
    'releaseYear',
    'description',
    'views',
];

const movieQuerySchema = [
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

export { movieSchemaPost, movieSchemaUpdate, movieQuerySchema };
