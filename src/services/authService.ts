import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { User } from '../models/user';
import { Favorite } from '../models/favorite';
import { getUserFromToken } from '../utils/authUtils';

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
                const favorites: Favorite[] = await prisma.favorite.findMany({
                    where: { userId: user.id },
                });

                user.favMovies = await prisma.movie.findMany({
                    where: { id: { in: favorites.map((f: any) => f.movieId) } },
                    include: { genres: { include: { genre: true } } },
                });
            }

            return user;
        } else {
            throw new Error('Invalid email or password');
        }
    },

    async validate(token: string): Promise<User> {
        const user = await getUserFromToken(token);

        if (user) {
            const favorites: Favorite[] = await prisma.favorite.findMany({
                where: { userId: user.id },
            });

            user.favMovies = await prisma.movie.findMany({
                where: { id: { in: favorites.map((f: any) => f.movieId) } },
                include: { genres: { include: { genre: true } } },
            });
        } else {
            throw new Error('User is not authenticated');
        }

        return user;
    },
};

export default authService;
