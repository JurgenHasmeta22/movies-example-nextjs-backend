import { body, query } from 'express-validator';

const allowedSortByProperties = ['userName', 'email'];

const userQuerySchema = [
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
    query('filterName').optional().isIn(['name', 'id']).withMessage('Invalid filterName value'),
    query('filterOperator')
        .optional()
        .isIn(['equals', 'contains', 'startsWith', 'endsWith'])
        .withMessage('Invalid filterOperator value'),
];

const userSchemaUpdate = [
    body('userName').optional().isString(),
    body('email').optional().isString().isEmail(),
    body('password').optional().isString(),
];
const userSchemaPost = [body('userName').isString(), body('email').isString().isEmail(), body('password').isString()];

export { userSchemaPost, userSchemaUpdate, userQuerySchema };
