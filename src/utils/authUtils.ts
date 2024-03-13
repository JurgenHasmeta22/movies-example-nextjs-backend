import jwt, { JwtPayload, Secret, VerifyErrors } from 'jsonwebtoken';
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

// function validateToken(token: string, userId: number): void {
//     const publicKey = process.env.PUBLIC_KEY; // Retrieve public key from environment variable
//     if (!publicKey) {
//         throw new Error('Public key not found');
//     }

//     jwt.verify(
//         token,
//         publicKey,
//         { algorithms: ['RS256'], audience: 'your_app_audience' },
//         (err: VerifyErrors | null, decoded: string | object) => {
//             if (err) {
//                 if (err.name === 'TokenExpiredError') {
//                     throw new Error('Token has expired');
//                 }
//                 throw new Error('Invalid token');
//             }

//             // Perform additional payload verification
//             if (typeof decoded === 'string') {
//                 throw new Error('Invalid decoded token');
//             }

//             if (decoded.id !== userId) {
//                 throw new Error('Token does not match user ID');
//             }

//             // Implement token rotation logic to handle token renewal
//             if (shouldRotateToken(decoded)) {
//                 throw new Error('Token rotation required');
//             }

//             // Perform token binding to ensure it's tied to a specific device or IP address
//             if (!isTokenBoundToUserDevice(decoded, userId)) {
//                 throw new Error('Token is not bound to user device');
//             }

//             if (decoded.exp < Math.floor(Date.now() / 1000)) {
//                 throw new Error('Token has expired');
//             }

//             if (!hasSufficientScopes(decoded, requiredScopes)) {
//                 throw new Error('Insufficient token scopes');
//             }

//             if (isTokenReplayed(decoded.jti)) {
//                 throw new Error('Token has been replayed');
//             }

//             if (decoded.ip !== ipAddress) {
//                 throw new Error('Token IP mismatch');
//             }

//             if (decoded.userAgent !== userAgent) {
//                 throw new Error('Token user-agent mismatch');
//             }
//         }
//     );
// }

// function shouldRotateToken(decodedToken: any): boolean {
//     const expirationThreshold = 60; // Threshold in seconds before token expiration
//     const currentTime = Math.floor(Date.now() / 1000);

//     // Check if the token expiration time is within the threshold for rotation
//     if (decodedToken.exp - currentTime < expirationThreshold) {
//         return true;
//     }

//     // Check for any custom claims indicating the need for rotation
//     if (decodedToken.rotation_required === true) {
//         return true;
//     }

//     // Add any other custom logic to determine if rotation is required based on token claims
//     // ...

//     return false; // Default to not requiring rotation
// }

// function isTokenBoundToUserDevice(token: string, currentDeviceInfo: string, currentIpAddress: string): boolean {
//     const secret: Secret = process.env.MY_SECRET || 'defaultSecret';
//     const decodedToken = jwt.verify(token, secret) as { device_info: string, ip_address: string };

//     // Check if the token device info and IP address match the current device info and IP address
//     if (decodedToken.device_info === currentDeviceInfo && decodedToken.ip_address === currentIpAddress) {
//         return true;
//     }

//     return false; // Default to token not being bound to the user's device or IP address
// }

// function isTokenRevoked(token: string): boolean {
//     return false;
// }

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
