import { Request, Response } from 'express';
import movieService from '../services/movie.service';
import { Movie } from '@prisma/client';

const movieController = {
    async getMovies(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, title, filterValue, filterName, filterOperator } = req.query;

        try {
            const movies = await movieService.getMovies({
                sortBy: sortBy as string,
                ascOrDesc: ascOrDesc as 'asc' | 'desc',
                perPage: pageSize ? Number(pageSize) : 20,
                page: Number(page),
                title: title as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName as string,
                filterOperatorString: filterOperator as '>' | '=' | '<',
            });

            if (movies) {
                res.status(200).send(movies);
            } else {
                res.status(404).send(null);
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getMovieById(req: Request, res: Response) {
        const movieId = Number(req.params.id);

        try {
            const movie = await movieService.getMovieById(movieId);

            if (movie) {
                res.status(200).send(movie);
            } else {
                res.status(404).send({ error: 'Movie not found' });
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
            res.status(200).send(movie);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getLatestMovies(req: Request, res: Response) {
        try {
            const latestMovies = await movieService.getLatestMovies();
            res.status(200).send(latestMovies);
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
                res.status(200).send(movie);
            } else {
                res.status(404).send({ error: 'Movie not found' });
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
                res.status(200).send(movie);
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
            res.status(200).send({
                msg: result === 'Movie deleted successfully' ? result : 'Movie was not deleted',
            });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async searchMoviesByTitle(req: Request, res: Response) {
        const { title, page } = req.query;

        try {
            const movies = await movieService.searchMoviesByTitle(String(title), Number(page));

            if (movies) {
                res.status(200).send(movies);
            } else {
                res.status(404).send(null);
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
};

export default movieController;
