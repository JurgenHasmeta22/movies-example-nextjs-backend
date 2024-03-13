import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { prisma } from '../index';
import { User } from '../models/user';

export function createToken(id: number) {
    const secret: Secret = process.env.MY_SECRET || 'defaultSecret';
    const token = jwt.sign({ id: id }, secret, {
        expiresIn: '3days',
    });

    return token;
}

export async function getUserFromToken(token: string) {
    const secret: Secret = process.env.MY_SECRET || 'defaultSecret';
    const data = jwt.verify(token, secret);
    const user: User | null = await prisma.user.findUnique({
        where: { id: (data as JwtPayload).id },
    });

    return user;
}
