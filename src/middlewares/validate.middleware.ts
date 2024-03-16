import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatusCode from '../utils/httpStatusCodes';

export function validateMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
    }

    next();
}
