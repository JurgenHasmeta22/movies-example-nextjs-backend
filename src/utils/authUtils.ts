export function createToken(id: number) {
    const token = jwt.sign({ id: id }, process.env.MY_SECRET, {
        expiresIn: '3days',
    });
    
    return token;
}

export async function getUserFromToken(token: string) {
    const data = jwt.verify(token, process.env.MY_SECRET);
    const user = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: data.id },
    });

    return user;
}