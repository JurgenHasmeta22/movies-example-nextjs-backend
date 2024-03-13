import { Request, Response } from 'express';
import movieService from '../services/movieService';
import { getUserFromToken } from '../utils/authUtils';
import { Movie } from '../models/movie';

const movieController = {
    async getMovies(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, title, filterValue, filterName, filterOperator } = req.query;
        const expectedParams = [
            'sortBy',
            'ascOrDesc',
            'page',
            'pageSize',
            'title',
            'filterValue',
            'filterName',
            'filterOperator',
        ];

        for (const key in req.query) {
            if (!expectedParams.includes(key)) {
                res.status(404).send('Not Found');
                return;
            }
        }

        try {
            const { rows, count } = await movieService.getMovies({
                sortBy: sortBy as string,
                ascOrDesc: ascOrDesc as 'asc' | 'desc',
                perPage: pageSize ? Number(pageSize) : 20,
                page: Number(page),
                title: title as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName as string,
                filterOperatorString: filterOperator as '>' | '=' | '<',
            });
            res.send({ rows, count });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getMovieById(req: Request, res: Response) {
        const movieId = Number(req.params.id);

        try {
            const movie = await movieService.getMovieById(movieId);
            res.send(movie);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getMovieByTitle(req: Request, res: Response) {
        const title = req.params.title
            .split('')
            .map((char) => (char === '-' ? ' ' : char))
            .join('');
        try {
            const movie = await movieService.getMovieByTitle(title);
            res.send(movie);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getLatestMovies(req: Request, res: Response) {
        try {
            const latestMovies = await movieService.getLatestMovies();
            res.send(latestMovies);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getFavoritesMoviesByUser(req: Request, res: Response) {
        const token = req.headers.authorization || '';

        try {
            const user = await getUserFromToken(token);

            if (user) {
                const favorites = await movieService.getFavoritesMoviesByUserId(user.id);
                res.send(favorites);
            } else {
                res.status(400).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async addFavoriteMovieByUser(req: Request, res: Response) {
        const token = req.headers.authorization || '';
        const { movieId } = req.body;

        try {
            const user = await getUserFromToken(token);

            if (user) {
                const updatedUser = await movieService.addFavoriteMovieByUserId(user.id, movieId);

                if (updatedUser) {
                    res.send(updatedUser);
                } else {
                    res.send({ error: 'User not found' });
                }
                res.send(updatedUser);
            } else {
                res.status(400).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async updateMovieById(req: Request, res: Response) {
        const movieBodyParams = req.body;

        try {
            const movie: Movie | null = await movieService.updateMovieById(movieBodyParams);

            if (movie) {
                res.send(movie);
            } else {
                res.status(400).send({ error: 'Movie not updated correctly' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async addMovie(req: Request, res: Response) {
        const movieBodyParams = req.body;
        console.log(movieBodyParams)
        try {
            const movie: Movie | null = await movieService.addMovie(movieBodyParams);

            if (movie) {
                res.send(movie);
            } else {
                res.status(400).send({ error: 'Movie not created correctly' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async deleteMovieById(req: Request, res: Response) {
        const idParam = Number(req.params.id);

        try {
            const result = await movieService.deleteMovieById(idParam);
            res.send({
                msg: result === 'Movie deleted successfully' ? result : 'Movie was not deleted',
            });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async searchMoviesByTitle(req: Request, res: Response) {
        const { title, page } = req.body;

        try {
            const { movies, count } = await movieService.searchMoviesByTitle(title, page);
            res.send({ movies, count });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
};

export default movieController;
