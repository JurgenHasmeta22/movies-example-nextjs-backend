import { body, param, query } from 'express-validator';

const genreSchemaUpdate = [body('name').optional().isString()];
const genreSchemaPost = [body('name').isString()];

const genreIdParamSchema = [param('id').isInt({ min: 1 }).withMessage('Invalid movie ID format')];

const genreNameParamSchema = [
    param('name')
        .isString()
        .trim()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Invalid movie name format'),
];

const allowedSortByProperties = ['name', 'id', 'createdAt', 'updatedAt'];

const genreQuerySchema = [
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
    query('name').optional().isString().withMessage('Title must be a string'),
    query('filterValue').optional().isString().withMessage('Filter value must be a string'),
    query('filterName').optional().isIn(['name', 'id']).withMessage('Invalid filterName value'),
    query('filterOperator')
        .optional()
        .isIn(['equals', 'contains', 'startsWith', 'endsWith'])
        .withMessage('Invalid filterOperator value'),
];

export { genreSchemaPost, genreSchemaUpdate, genreQuerySchema, genreIdParamSchema, genreNameParamSchema };
