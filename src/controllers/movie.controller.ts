import { Request, Response } from 'express';
import movieService from '../services/movieService';
import { getUserFromToken } from '../utils/authUtils';
import { Movie } from '../models/movie';
import { User } from '../models/user';

interface CustomRequest extends Request {
    user?: User;
}

const movieController = {
    async getMovies(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, title, filterValue, filterName, filterOperator } = req.query;
        
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

            if (movie) {
                res.send(movie);
            } else {
                res.status(400).send({ error: 'Movie not found' });
            }
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
    async addFavoriteMovieByUser(req: Request, res: Response) {
        const { movieId, userId } = req.body;

        try {
            const updatedUser = await movieService.addFavoriteMovieByUserId(userId, movieId);

            if (updatedUser) {
                res.send(updatedUser);
            } else {
                res.send({ error: 'Favorites movies not updated' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async updateMovieById(req: Request, res: Response) {
        const movieBodyParams = req.body;
        const { id } = req.params;

        try {
            const movie: Movie | null = await movieService.updateMovieById(movieBodyParams, id);

            if (movie) {
                res.send(movie);
            } else {
                res.status(400).send({ error: 'Movie not updated' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async addMovie(req: Request, res: Response) {
        const movieBodyParams = req.body;

        try {
            const movie: Movie | null = await movieService.addMovie(movieBodyParams);

            if (movie) {
                res.send(movie);
            } else {
                res.status(400).send({ error: 'Movie not created' });
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
        const { title, page } = req.query;

        try {
            const { movies, count } = await movieService.searchMoviesByTitle(String(title), Number(page));
            res.send({ movies, count });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
};

export default movieController;
