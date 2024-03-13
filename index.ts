import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient({
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

function createToken(id: number) {
    //@ts-ignore
    const token = jwt.sign({ id: id }, process.env.MY_SECRET, {
        expiresIn: '3days',
    });
    return token;
}

async function getUserFromToken(token: string) {
    //@ts-ignore
    const data = jwt.verify(token, process.env.MY_SECRET);
    const user = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: data.id },
    });

    return user;
}

app.post('/sign-up', async (req, res) => {
    const { email, password, userName } = req.body;

    try {
        const hash = bcrypt.hashSync(password);
        const user = await prisma.user.create({
            data: { email, password: hash, userName },
        });
        //@ts-ignore
        user.favMovies = [];
        res.send({ user, token: createToken(user.id) });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // @ts-ignore
        const passwordMatches = bcrypt.compareSync(password, user.password);

        if (user && passwordMatches) {
            const favorites = await prisma.favorite.findMany({
                where: { userId: user?.id },
            });
            //@ts-ignore
            user.favMovies = await prisma.movie.findMany({
                //@ts-ignore
                where: { id: { in: favorites.map((f: any) => f.movieId) } },
                include: { genres: { include: { genre: true } } },
            });
            res.send({ user, token: createToken(user.id) });
        } else {
            throw Error('Boom');
        }
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/validate', async (req, res) => {
    const token = req.headers.authorization || '';

    try {
        const user = await getUserFromToken(token);
        //favourite movies
        const favorites = await prisma.favorite.findMany({
            where: { userId: user?.id },
        });
        //@ts-ignore
        user.favMovies = await prisma.movie.findMany({
            //@ts-ignore
            where: { id: { in: favorites.map((f: any) => f.movieId) } },
            include: { genres: { include: { genre: true } } },
        });
        res.send(user);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/movies/page/:pagenr', async (req, res) => {
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
        let movies;
        let count;

        if (!titleQuery && !filterValue) {
            movies = await prisma.movie.findMany({
                include: { genres: { include: { genre: true } } },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.movie.count();
        } else if (titleQuery && !filterValue) {
            movies = await prisma.movie.findMany({
                where: {
                    title: { contains: title },
                },
                include: { genres: { include: { genre: true } } },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.movie.count({
                where: {
                    title: { contains: title },
                },
            });
        } else if (!titleQuery && filterValue) {
            movies = await prisma.movie.findMany({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
                include: { genres: { include: { genre: true } } },
                orderBy: {
                    //@ts-ignore
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });
            count = await prisma.movie.count({
                where: {
                    [filterNameString]: {
                        [filterOperatorString]: filterValueString,
                    },
                },
            });
        }
        res.send({ rows: movies, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

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

app.get('/movies', async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.send(movies);
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

app.get('/moviesNoPagination/:id', async (req, res) => {
    const movieId = Number(req.params.id);
    const movie = await prisma.movie.findFirst({
        where: { id: movieId },
        include: { genres: { include: { genre: true } } },
    });

    try {
        res.send(movie);
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

app.get('/movie/:title', async (req, res) => {
    const title = req.params.title
        .split('')
        .map((char) => (char === '-' ? ' ' : char))
        .join('');

    try {
        const movie = await prisma.movie.findFirst({
            where: { title },
            include: { genres: { include: { genre: true } } },
        });
        res.send(movie);
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

app.get('/favorites', async (req, res) => {
    const token = req.headers.authorization || '';

    try {
        const user = await getUserFromToken(token);
        const favorites = await prisma.favorite.findMany({
            where: { userId: user?.id },
        });
        res.send(favorites);
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/latest', async (req, res) => {
    const latestMovies = await prisma.movie.findMany({
        orderBy: {
            id: 'desc',
        },
        take: 20,
        include: { genres: { include: { genre: true } } },
    });
    res.send(latestMovies);
});

app.get('/movies-count', async (req, res) => {
    try {
        const count = await prisma.movie.count();
        res.send({ count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.get('/movie-count', async (req, res) => {
    try {
        const count = await prisma.movie.count();
        res.send({ count });
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

app.post('/search', async (req, res) => {
    const { title, page } = req.body;

    try {
        const movies = await prisma.movie.findMany({
            where: {
                title: { contains: title },
            },
            include: { genres: { include: { genre: true } } },
            skip: (page - 1) * 20,
            take: 20,
        });

        const count = await prisma.movie.count({
            where: {
                title: { contains: title },
            },
        });

        res.send({ movies, count });
    } catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message });
    }
});

app.post('/favorites', async (req, res) => {
    const token = req.headers.authorization || '';
    const { movieId } = req.body;

    try {
        const user = await getUserFromToken(token);

        const favorite = await prisma.favorite.create({
            //@ts-ignore
            data: { userId: user.id, movieId: movieId },
        });

        const favorites = await prisma.favorite.findMany({
            where: { userId: user?.id },
        });

        const generes = await prisma.genre.findMany();
        //@ts-ignore
        user.favMovies = await prisma.movie.findMany({
            where: { id: { in: favorites.map((f) => f.movieId) } },
            include: { genres: { include: { genre: true } } },
        });

        res.send(user);
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

app.delete('/movies/:id', async (req, res) => {
    const idParam = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: { id: idParam },
        });
        if (movie) {
            await prisma.movie.delete({
                where: { id: idParam },
            });
            const movies = await prisma.movie.findMany();
            res.send({
                msg: 'Event deleted succesfully',
                rows: movies,
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
