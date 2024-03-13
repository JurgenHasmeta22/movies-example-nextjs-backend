// authController.ts
import { Request, Response } from 'express';
import authService from '../services/authService';
import { User } from '../types/user';
import { createToken } from '../utils/authUtils';

const authController = {
    async signUp(req: Request, res: Response) {
        const { email, password, userName } = req.body;

        try {
            const user: User = await authService.signUp({ email, password, userName });
            res.send({ user, token: createToken(user.id) });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user: User = await authService.login(email, password);
            res.send({ user, token: createToken(user.id) });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },

    async validate(req: Request, res: Response) {
        const token: string = req.headers.authorization || '';

        try {
            const user: User = await authService.validate(token);
            res.send(user);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
};

export default authController;
