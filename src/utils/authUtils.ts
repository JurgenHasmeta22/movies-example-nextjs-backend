import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { prisma } from '../index';
import { User } from '../models/user';

export function createToken(id: number) {
    try {
        const secret: Secret = process.env.MY_SECRET || 'defaultSecret';
        const token = jwt.sign({ id: id }, secret, {
            expiresIn: '1days',
        });

        if (token) {
            return token;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Failed to create token');
    }
}

function logAudit(activity: string, userId: number, action: string) {
    console.log(`Activity: ${activity} - User ID: ${userId} - Action: ${action}`);
}

export async function getUserFromToken(token: string) {
    try {
        const secret: Secret = process.env.MY_SECRET || 'defaultSecret';
        const data = jwt.verify(token, secret);
        const user: User | null = await prisma.user.findUnique({
            where: { id: (data as JwtPayload).id },
            include: {
                favMovies: { select: { movie: { include: { genres: { select: { genre: true } } } } } },
                comments: { select: { content: true } },
            },
        });

        if (user) {
            logAudit('UserRetrieval', user.id, 'getUserFromToken');
            return user;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Failed to retrieve user from token');
    }
}
