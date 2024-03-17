import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { createToken } from '../utils/authUtils';
import { User } from '@prisma/client';
import HttpStatusCode from '../utils/httpStatusCodes';

interface CustomRequest extends Request {
    user?: User;
}

const authController = {
    async signUp(req: Request, res: Response) {
        const { email, password, userName } = req.body;

        try {
            const user: User | null = await authService.signUp({ email, password, userName });

            if (user) {
                res.status(HttpStatusCode.OK).send({ user, token: createToken(user.id) });
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User already exists' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user: User | null = await authService.login(email, password);

            if (user) {
                res.status(HttpStatusCode.OK).send({ user, token: createToken(user.id) });
            } else {
                res.status(HttpStatusCode.BadRequest).send({ error: 'Credentials are wrong' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async validate(req: CustomRequest, res: Response) {
        try {
            if (req.user) {
                res.status(HttpStatusCode.OK).send(req.user);
            } else {
                res.status(HttpStatusCode.BadRequest).send({ error: 'User not validated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
};

export default authController;
