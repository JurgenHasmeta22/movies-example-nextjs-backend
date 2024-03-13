import { body } from 'express-validator';

const genreSchemaUpdate = [body('name').optional().isString()];
const genreSchemaPost = [body('name').isString()];

export { genreSchemaPost, genreSchemaUpdate };
