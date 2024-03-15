import { body } from 'express-validator';

const registerSchema = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
    body('userName')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9]*$/)
        .withMessage('Username must contain only letters and numbers'),
];

const loginSchema = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
];

export { registerSchema, loginSchema };
