import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateMovie = () => {
    return [
        body('title').isString().notEmpty(),
        body('videoSrc').isString().notEmpty(),
        body('photoSrc').isString().notEmpty(),
        body('trailerSrc').isString().notEmpty(),
        body('duration').isString().notEmpty(),
        body('ratingImdb').isFloat().notEmpty(),
        body('releaseYear').isInt().notEmpty(),
        body('description').isString().notEmpty(),
        body('views').isInt().notEmpty(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            next();
        },
    ];
};
