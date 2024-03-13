import { body } from 'express-validator';

const userSchemaUpdate = [
    body('userName').optional().isString(),
    body('email').optional().isString().isEmail(),
    body('password').optional().isString(),
];
const userSchemaPost = [body('userName').isString(), body('email').isString().isEmail(), body('password').isString()];

export { userSchemaPost, userSchemaUpdate };
