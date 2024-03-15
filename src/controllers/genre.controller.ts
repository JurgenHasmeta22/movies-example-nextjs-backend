import { Request, Response } from 'express';
import genreService from '../services/genre.service';
import { Genre } from '../models/genre.model';

const genreController = {
    async getGenres(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, name, filterValue, filterName, filterOperator } = req.query;

        try {
            const { rows } = await genreService.getGenres({
                sortBy: sortBy! as string,
                ascOrDesc: ascOrDesc! as 'asc' | 'desc',
                perPage: pageSize ? Number(pageSize) : 20,
                page: Number(page!),
                name: name! as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName! as string,
                filterOperatorString: filterOperator! as '>' | '=' | '<',
            });

            res.status(200).send({ genres: rows });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getGenreById(req: Request, res: Response) {
        const genreId = Number(req.params.id);

        try {
            const genre = await genreService.getGenreById(genreId);

            if (genre) {
                res.status(200).send(genre);
            } else {
                res.status(404).send({ error: 'Genre not found' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async getGenreByName(req: Request, res: Response) {
        const name = req.params.name
            .split('')
            .map((char) => (char === '-' ? ' ' : char))
            .join('');
        try {
            const genre = await genreService.getGenreByName(name);
            res.status(200).send(genre);
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async addGenre(req: Request, res: Response) {
        const genreBodyParams = req.body;

        try {
            const genre: Genre | null = await genreService.addGenre(genreBodyParams);

            if (genre) {
                res.status(200).send(genre);
            } else {
                res.status(400).send({ error: 'Genre not created' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async updateGenreById(req: Request, res: Response) {
        const genreBodyParams = req.body;
        const { id } = req.params;

        try {
            const genre: Genre | null = await genreService.updateGenreById(genreBodyParams, id);

            if (genre) {
                res.status(200).send(genre);
            } else {
                res.status(400).send({ error: 'Genre not updated' });
            }
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async deleteGenreById(req: Request, res: Response) {
        const idParam = Number(req.params.id);

        try {
            const result = await genreService.deleteGenreById(idParam);
            res.status(200).send({
                msg: result === 'Genre deleted successfully' ? result : 'Genre was not deleted',
            });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
    async searchGenresByName(req: Request, res: Response) {
        const { name, page } = req.query;

        try {
            const { genres } = await genreService.searchGenresByName(String(name), Number(page));
            res.status(200).send({ genres: genres });
        } catch (err) {
            res.status(400).send({ error: (err as Error).message });
        }
    },
};

export default genreController;
