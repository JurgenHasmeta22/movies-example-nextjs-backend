import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import movieRoutes from './routes/movieRoutes';
import 'dotenv/config';

export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.send('Server Up and Running');
});
app.listen(4000, () => {
    console.log(`Server up: http://localhost:4000`);
});

app.use(movieRoutes);

app.get('/series/page/:pagenr', async (req, res) => {
    const sortBy = req.query.sortBy;
    const ascOrDesc = req.query.ascOrDesc;
    const perPage = Number(req.query.perPage);
    const page = Number(req.params.pagenr);
    const titleQuery = req.query.title;
    const title = String(req.query.title);
    const filterValue = req.query.filterValue;
    let filterValueString: number | string = String(req.query.filterValue);
    const filterNameString = String(req.query.filterName);
    let filterOperatorString = String(req.query.filterOperator);

    if (filterValueString.match(/\d+/g) != null) {
        filterValueString = Number(filterValueString);
    }
    if (filterOperatorString === '>') {
        filterOperatorString = 'gt';
    } else if (filterOperatorString === '=') {
        filterOperatorString = 'equals';
    } else if (filterOperatorString === '<') {
        filterOperatorString = 'lt';
    }

    let nrToSkip;

    if (perPage) {
        nrToSkip = (page - 1) * perPage;
    } else {
        nrToSkip = (page - 1) * 20;
    }

    try {
        let series;
        let count;

        if (titleQuery && !filterValue) {
            series = await prisma.serie.findMany({
                where: {
                    title: { contains: title },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.serie.count({
                where: {
                    title: { contains: title },
                },
            });
        } else if (!titleQuery && !filterValue) {
            series = await prisma.serie.findMany({
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.serie.count();
        } else if (!titleQuery && filterValue) {
            series = await prisma.serie.findMany({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.serie.count({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
            });
        }
        res.send({ rows: series, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/episodes/page/:pagenr', async (req, res) => {
    const sortBy = req.query.sortBy;
    const ascOrDesc = req.query.ascOrDesc;
    const perPage = Number(req.query.perPage);
    const page = Number(req.params.pagenr);
    const titleQuery = req.query.title;
    const title = String(req.query.title);
    const filterValue = req.query.filterValue;
    let filterValueString: number | string = String(req.query.filterValue);
    const filterNameString = String(req.query.filterName);
    let filterOperatorString = String(req.query.filterOperator);

    if (filterValueString.match(/\d+/g) != null) {
        filterValueString = Number(filterValueString);
    }
    if (filterOperatorString === '>') {
        filterOperatorString = 'gt';
    } else if (filterOperatorString === '=') {
        filterOperatorString = 'equals';
    } else if (filterOperatorString === '<') {
        filterOperatorString = 'lt';
    }

    let nrToSkip;

    if (perPage) {
        nrToSkip = (page - 1) * perPage;
    } else {
        nrToSkip = (page - 1) * 20;
    }

    try {
        let episodes;
        let count;

        if (titleQuery && !filterValue) {
            episodes = await prisma.episode.findMany({
                where: {
                    title: { contains: title },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.episode.count({
                where: {
                    title: { contains: title },
                },
            });
        } else if (!titleQuery && !filterValue) {
            episodes = await prisma.episode.findMany({
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.episode.count();
        } else if (!titleQuery && filterValue) {
            episodes = await prisma.episode.findMany({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.episode.count({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
            });
        }
        res.send({ rows: episodes, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genres/page/:pagenr', async (req, res) => {
    const sortBy = req.query.sortBy;
    const ascOrDesc = req.query.ascOrDesc;
    const perPage = Number(req.query.perPage);
    const page = Number(req.params.pagenr);
    const titleQuery = req.query.title;
    const title = String(req.query.title);
    const filterValue = req.query.filterValue;
    let filterValueString: number | string = String(req.query.filterValue);
    const filterNameString = String(req.query.filterName);
    let filterOperatorString = String(req.query.filterOperator);

    if (filterValueString.match(/\d+/g) != null) {
        filterValueString = Number(filterValueString);
    }
    if (filterOperatorString === '>') {
        filterOperatorString = 'gt';
    } else if (filterOperatorString === '=') {
        filterOperatorString = 'equals';
    } else if (filterOperatorString === '<') {
        filterOperatorString = 'lt';
    }

    let nrToSkip;

    if (perPage) {
        nrToSkip = (page - 1) * perPage;
    } else {
        nrToSkip = (page - 1) * 20;
    }

    try {
        let genres;
        let count;

        if (titleQuery && !filterValue) {
            genres = await prisma.genre.findMany({
                where: {
                    name: { contains: title },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.genre.count({
                where: {
                    name: { contains: title },
                },
            });
        } else if (!titleQuery && !filterValue) {
            genres = await prisma.genre.findMany({
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.genre.count();
        } else if (!titleQuery && filterValue) {
            genres = await prisma.genre.findMany({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.genre.count({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
            });
        }
        res.send({ rows: genres, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/users/page/:pagenr', async (req, res) => {
    const sortBy = req.query.sortBy;
    const ascOrDesc = req.query.ascOrDesc;
    const perPage = Number(req.query.perPage);
    const page = Number(req.params.pagenr);
    const titleQuery = req.query.title;
    const title = String(req.query.title);
    const filterValue = req.query.filterValue;
    let filterValueString: number | string = String(req.query.filterValue);
    const filterNameString = String(req.query.filterName);
    let filterOperatorString = String(req.query.filterOperator);

    if (filterValueString.match(/\d+/g) != null) {
        filterValueString = Number(filterValueString);
    }
    if (filterOperatorString === '>') {
        filterOperatorString = 'gt';
    } else if (filterOperatorString === '=') {
        filterOperatorString = 'equals';
    } else if (filterOperatorString === '<') {
        filterOperatorString = 'lt';
    }

    let nrToSkip;

    if (perPage) {
        nrToSkip = (page - 1) * perPage;
    } else {
        nrToSkip = (page - 1) * 20;
    }

    try {
        let users;
        let count;

        if (titleQuery && !filterValue) {
            users = await prisma.user.findMany({
                where: {
                    userName: { contains: title },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.user.count({
                where: {
                    userName: { contains: title },
                },
            });
        } else if (!titleQuery && !filterValue) {
            users = await prisma.user.findMany({
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.user.count();
        } else if (!titleQuery && filterValue) {
            users = await prisma.user.findMany({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.user.count({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
            });
        }
        res.send({ rows: users, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genres', async (req, res) => {
    try {
        const genres = await prisma.genre.findMany();
        res.send(genres);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.send(users);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/series', async (req, res) => {
    try {
        const series = await prisma.serie.findMany();
        res.send(series);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/episodes', async (req, res) => {
    try {
        const episodes = await prisma.episode.findMany();
        res.send(episodes);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/seriesNoPagination/:id', async (req, res) => {
    const serieId = Number(req.params.id);
    const serie = await prisma.serie.findFirst({
        where: { id: serieId },
        include: { episodes: true },
    });

    try {
        res.send(serie);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/episodesNoPagination/:id', async (req, res) => {
    const episodeId = Number(req.params.id);
    const episode = await prisma.episode.findFirst({
        where: { id: episodeId },
        include: { serie: true },
    });

    try {
        res.send(episode);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genresNoPagination/:id', async (req, res) => {
    const genreId = Number(req.params.id);
    const genre = await prisma.genre.findFirst({
        where: { id: genreId },
        include: { movies: { include: { movie: true } } },
    });

    try {
        res.send(genre);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/usersNoPagination/:id', async (req, res) => {
    const userId = Number(req.params.id);
    const user = await prisma.user.findFirst({
        where: { id: userId },
        include: { favoriteMovies: { include: { movie: true } } },
    });

    try {
        res.send(user);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/seria/:title', async (req, res) => {
    const title = req.params.title
        .split('')
        .map((char) => (char === '-' ? ' ' : char))
        .join('');

    try {
        const seria = await prisma.episode.findFirst({
            where: { title },
            include: { serie: true },
        });
        res.send(seria);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/series/:serie', async (req, res) => {
    const serie = req.params.serie;
    let page = Number(req.query.page);

    try {
        const serial = await prisma.serie.findFirst({
            where: { title: serie },
            // @ts-ignore
            include: { episodes: true },
            take: 20,
            skip: (page - 1) * 20,
        });
        res.send({ serial });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genresAll/:genre', async (req, res) => {
    const genre = req.params.genre;
    const genreId = await prisma.genre.findFirst({
        where: { name: genre },
    });
    const count = await prisma.movieGenre.count({
        where: {
            genreId: genreId?.id,
        },
    });

    try {
        const movies = await prisma.movie.findMany({
            where: {
                genres: {
                    some: {
                        genre: {
                            name: genre,
                        },
                    },
                },
            },
            include: { genres: { include: { genre: true } } },
        });

        res.send({ movies, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genres/:genre', async (req, res) => {
    const genre = req.params.genre;
    const page = Number(req.query.page);
    const genreId = await prisma.genre.findFirst({
        where: { name: genre },
    });
    const count = await prisma.movieGenre.count({
        where: {
            genreId: genreId?.id,
        },
    });

    try {
        const movies = await prisma.movie.findMany({
            where: {
                genres: {
                    some: {
                        genre: {
                            name: genre,
                        },
                    },
                },
            },
            include: { genres: { include: { genre: true } } },
            take: 20,
            skip: (page - 1) * 20,
        });
        res.send({ movies, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/series-count', async (req, res) => {
    try {
        const count = await prisma.serie.count();
        res.send({ count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/episodes-count', async (req, res) => {
    try {
        const count = await prisma.episode.count();
        res.send({ count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/genres-count', async (req, res) => {
    try {
        const count = await prisma.genre.count();
        res.send({ count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/users-count', async (req, res) => {
    try {
        const count = await prisma.user.count();
        res.send({ count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.post('/series', async (req, res) => {
    const { title, photoSrc, ratingImdb, releaseYear } = req.body;
    const series = await prisma.serie.findMany();
    const createdSerie = {
        id: series.length + 1,
        title,
        photoSrc,
        ratingImdb,
        releaseYear,
    };

    try {
        //@ts-ignore
        await prisma.serie.create({ data: createdSerie });
        const series = await prisma.serie.findMany();

        res.status(200).send(series);
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.post('/episodes', async (req, res) => {
    const { title, photoSrc, videoSrc, description, serieId } = req.body;
    const episodes = await prisma.episode.findMany();
    const createdEpisode = {
        id: episodes.length + 1,
        title,
        photoSrc,
        videoSrc,
        description,
        serieId,
    };

    try {
        //@ts-ignore
        await prisma.episode.create({ data: createdEpisode });
        const episodes = await prisma.episode.findMany();

        res.status(200).send(episodes);
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.delete('/genres/:id', async (req, res) => {
    const idParam = Number(req.params.id);

    try {
        const genre = await prisma.genre.findUnique({
            where: { id: idParam },
        });

        if (genre) {
            await prisma.genre.delete({
                where: { id: idParam },
            });
            const genres = await prisma.genre.findMany();
            res.send({
                msg: 'Event deleted succesfully',
                rows: genres,
            });
        } else {
            throw Error('You are not authorized, or Event with this Id doesnt exist!');
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.delete('/episodes/:id', async (req, res) => {
    const idParam = Number(req.params.id);

    try {
        const episode = await prisma.episode.findUnique({
            where: { id: idParam },
        });

        if (episode) {
            await prisma.episode.delete({
                where: { id: idParam },
            });
            const episodes = await prisma.episode.findMany();
            res.send({
                msg: 'Event deleted succesfully',
                rows: episodes,
            });
        } else {
            throw Error('You are not authorized, or Event with this Id doesnt exist!');
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.delete('/series/:id', async (req, res) => {
    const idParam = Number(req.params.id);

    try {
        const serie = await prisma.serie.findUnique({
            where: { id: idParam },
        });
        if (serie) {
            await prisma.serie.delete({
                where: { id: idParam },
            });
            const series = await prisma.serie.findMany();
            res.send({
                msg: 'Event deleted succesfully',
                rows: series,
            });
        } else {
            throw Error('You are not authorized, or Event with this Id doesnt exist!');
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    const idParam = Number(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id: idParam },
        });

        if (user) {
            await prisma.user.delete({
                where: { id: idParam },
            });
            const users = await prisma.user.findMany();
            res.send({
                msg: 'Event deleted succesfully',
                rows: users,
            });
        } else {
            throw Error('You are not authorized, or Event with this Id doesnt exist!');
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.patch('/series/:id', async (req, res) => {
    const { id, title, photoSrc, ratingImdb, releaseYear } = req.body;
    const updatedSerie = {
        id,
        title,
        photoSrc,
        ratingImdb,
        releaseYear,
    };

    try {
        const findSerie = await prisma.serie.findFirst({ where: { id } });
        if (findSerie) {
            await prisma.serie.update({ where: { id }, data: updatedSerie });
            const series = await prisma.serie.findMany();

            res.status(200).send({
                msg: 'Serie deleted succesfully',
                series,
            });
        } else {
            res.status(400).send({ error: 'No Serie' });
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.patch('/episodes/:id', async (req, res) => {
    const { id, title, photoSrc, videoSrc, description } = req.body;
    const updatedEpisode = {
        id,
        title,
        photoSrc,
        videoSrc,
        description,
    };

    try {
        const findEpisode = await prisma.episode.findFirst({ where: { id } });
        if (findEpisode) {
            await prisma.serie.update({ where: { id }, data: updatedEpisode });
            const episodes = await prisma.episode.findMany();

            res.status(200).send({
                msg: 'Serie deleted succesfully',
                episodes,
            });
        } else {
            res.status(400).send({ error: 'No episode' });
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message });
    }
});
