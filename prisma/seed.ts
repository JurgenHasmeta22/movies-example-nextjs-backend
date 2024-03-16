import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { series, seasons, episodes } from './movies';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const users = [
    {
        id: 1,
        userName: 'avenger22',
        email: 'jurgenhasmeta@email.com',
        password: bcrypt.hashSync('jurgen123', 8),
    },
    {
        id: 2,
        userName: 'geri12',
        email: 'geri@email.com',
        password: bcrypt.hashSync('geri123', 8),
    },
    {
        id: 3,
        userName: 'visard12',
        email: 'andrea@email.com',
        password: bcrypt.hashSync('visard123', 8),
    },
    {
        id: 4,
        userName: 'marsel12',
        email: 'marsel@email.com',
        password: bcrypt.hashSync('marsel123', 8),
    },
];

async function createStuff() {
    await prisma.serie.deleteMany();

    for (const serie of series) {
        await prisma.serie.create({ data: serie });
    }

    // await prisma.season.deleteMany();

    for (const season of seasons) {
        await prisma.season.create({ data: season });
    }

    await prisma.episode.deleteMany();

    for (const episode of episodes) {
        await prisma.episode.create({ data: episode });
    }

    // await prisma.user.deleteMany();

    // for (const user of users) {
    //   await prisma.user.create({ data: user });
    // }

    // await prisma.genre.deleteMany();

    // for (const genre of genres) {
    //   await prisma.genre.create({ data: genre });
    // }

    // await prisma.movie.deleteMany();

    // for (const movie of movies) {
    //   await prisma.movie.create({
    //     data: { ...movie, views: Math.floor(Math.random() * 1000) },
    //   });
    // }

    // await prisma.movieGenre.deleteMany();

    // for (const movieGenre in movieGenres) {
    //   for (const genre of movieGenres[movieGenre]) {
    //     await prisma.movieGenre.create({
    //       data: { genreId: genre, movieId: Number(movieGenre) + 1 },
    //     });
    //   }
    // }
}

createStuff();
