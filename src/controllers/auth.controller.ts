import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { createToken } from '../utils/authUtils';
import { User } from '@prisma/client';

interface CustomRequest extends Request {
    user?: User;
}

const authController = {
    async signUp(req: Request, res: Response) {
        const { email, password, userName } = req.body;

        try {
            const user: User | null = await authService.signUp({ email, password, userName });

            if (user) {
                res.status(200).send({ user, token: createToken(user.id) });
            } else {
                res.status(409).send({ error: 'User already exists' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user: User | null = await authService.login(email, password);

            if (user) {
                res.status(200).send({ user, token: createToken(user.id) });
            } else {
                res.status(400).send({ error: 'Credentials are wrong' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async validate(req: CustomRequest, res: Response) {
        try {
            if (req.user) {
                res.status(200).send(req.user);
            } else {
                res.status(400).send({ error: 'User not validated' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
};

export default authController;
