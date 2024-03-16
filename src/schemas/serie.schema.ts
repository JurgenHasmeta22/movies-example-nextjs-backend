import { body, param, query } from 'express-validator';

const allowedSortByProperties = ['id', 'photoSrc', 'releaseYear', 'title', 'ratingImdb'];

const serieQuerySchema = [
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

const serieIdParamSchema = [param('id').isInt({ min: 1 }).withMessage('Invalid serie ID format')];

const serieTitleParamSchema = [
    param('title')
        .isString()
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Invalid serie title format'),
];

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

export { serieSchemaPost, serieSchemaUpdate, serieQuerySchema, serieIdParamSchema, serieTitleParamSchema };
