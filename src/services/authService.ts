// authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/user';
import { getUserFromToken } from '../utils/authUtils';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const authService = {
    async signUp(userData: { email: string; password: string; userName: string }): Promise<User> {
        const { email, password, userName } = userData;
        const hash = bcrypt.hashSync(password);
        const user: User = await prisma.user.create({
            data: { email, password: hash, userName },
        });
        
        user.favMovies = [];
        return user;
    },

    async login(email: string, password: string): Promise<User> {
        const user: User | null = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            const passwordMatches: boolean = bcrypt.compareSync(password, user.password);

            if (passwordMatches) {
                const favorites = await prisma.favorite.findMany({
                    where: { userId: user?.id },
                });
                user.favMovies = await prisma.movie.findMany({
                    where: { id: { in: favorites.map((f: any) => f.movieId) } },
                    include: { genres: { include: { genre: true } } },
                });
            }
        } else {
            throw new Error('Invalid email or password');
        }
    },

    async validate(token: string): Promise<User> {
        const user = await getUserFromToken(token);
        const favorites = await prisma.favorite.findMany({
            where: { userId: user?.id },
        });

        user.favMovies = await prisma.movie.findMany({
            //@ts-ignore
            where: { id: { in: favorites.map((f: any) => f.movieId) } },
            include: { genres: { include: { genre: true } } },
        });

        return user;
    },
};

export default authService;
