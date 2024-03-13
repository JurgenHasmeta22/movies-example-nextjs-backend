import { Request, Response } from 'express';
import movieService from '../services/movieService';
import { getUserFromToken } from '../utils/authUtils';

const movieController = {
    async getMoviesByPage(req: Request, res: Response) {
        const { sortBy, ascOrDesc, perPage, pagenr } = req.query;
        const { title, filterValue, filterName, filterOperator } = req.query;

        try {
            const { rows, count } = await movieService.getMoviesByPage({
                sortBy: sortBy as string,
                ascOrDesc: ascOrDesc as 'asc' | 'desc',
                perPage: perPage ? Number(perPage) : 20,
                page: Number(pagenr),
                title: title as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName as string,
                filterOperatorString: filterOperator as '>' | '=' | '<',
            });

            res.send({ rows, count });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
    async getMovies(req: Request, res: Response) {
        try {
            const movies = await movieService.getMovies();
            res.send(movies);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
    async getMovieNoPaginationById(req: Request, res: Response) {
        const movieId = Number(req.params.id);
        try {
            const movie = await movieService.getMovieNoPaginationById(movieId);
            res.send(movie);
        } catch (err) {
            res.status(400).send({ error: err.message });
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
            res.status(400).send({ error: err.message });
        }
    },
    async getLatestMovies(req: Request, res: Response) {
        try {
            const latestMovies = await movieService.getLatestMovies();
            res.send(latestMovies);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
    async getMoviesCount(req: Request, res: Response) {
        try {
            const count = await movieService.getMoviesCount();
            res.send({ count });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
    async getFavoritesMoviesByUser(req: Request, res: Response) {
        const token = req.headers.authorization || '';

        try {
            const user = await getUserFromToken(token);

            if (user) {
                const favorites = await movieService.getFavoritesByUserId(user.id);
                res.send(favorites);
            } else {
                res.status(400).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(400).send({ error: err.message });
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
            res.status(400).send({ error: err.message });
        }
    },
    async deleteMovie(req: Request, res: Response) {
        const idParam = Number(req.params.id);

        try {
            const movies = await movieService.deleteMovieById(idParam);
            res.send({
                msg: 'Movie deleted successfully',
                rows: movies,
            });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
    async searchMovies(req: Request, res: Response) {
        const { title, page } = req.body;

        try {
            const { movies, count } = await movieService.searchMoviesByTitle(title, page);
            res.send({ movies, count });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    },
};

export default movieController;
