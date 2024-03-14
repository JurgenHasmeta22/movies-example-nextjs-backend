import { NextFunction, Request, Response } from 'express';
import { getUserFromToken } from '../utils/authUtils';
import { User } from '../models/user';

interface CustomRequest extends Request {
    user?: User;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization!;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await getUserFromToken(token);

        if (user) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
