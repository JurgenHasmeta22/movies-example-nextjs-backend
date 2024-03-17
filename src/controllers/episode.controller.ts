import { Request, Response } from 'express';
import episodeService from '../services/episode.service';
import { Episode } from '@prisma/client';
import HttpStatusCode from '../utils/httpStatusCodes';

const episodeController = {
    async getEpisodes(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, title, filterValue, filterName, filterOperator } = req.query;

        try {
            const episodes = await episodeService.getEpisodes({
                sortBy: sortBy as string,
                ascOrDesc: ascOrDesc as 'asc' | 'desc',
                perPage: pageSize ? Number(pageSize) : 20,
                page: Number(page),
                title: title as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName as string,
                filterOperatorString: filterOperator as '>' | '=' | '<',
            });

            if (episodes) {
                res.status(HttpStatusCode.OK).send(episodes);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'Episodes not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async getEpisodeById(req: Request, res: Response) {
        const episodeId = Number(req.params.id);

        try {
            const episode = await episodeService.getEpisodeById(episodeId);

            if (episode) {
                res.status(HttpStatusCode.OK).send(episode);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'Episode not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async getEpisodeByTitle(req: Request, res: Response) {
        const title = req.params.title
            .split('')
            .map((char) => (char === '-' ? ' ' : char))
            .join('');
        try {
            const episode = await episodeService.getEpisodeByTitle(title);

            if (episode) {
                res.status(HttpStatusCode.OK).send(episode);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'Episode not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async updateEpisodeById(req: Request, res: Response) {
        const episodeBodyParams = req.body;
        const { id } = req.params;

        try {
            const episode: Episode | null = await episodeService.updateEpisodeById(episodeBodyParams, id);

            if (episode) {
                res.status(HttpStatusCode.OK).send(episode);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'Episode not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addEpisode(req: Request, res: Response) {
        const episodeBodyParams = req.body;

        try {
            const episode: Episode | null = await episodeService.addEpisode(episodeBodyParams);

            if (episode) {
                res.status(HttpStatusCode.Created).send(episode);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'Episode not created' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async deleteEpisodeById(req: Request, res: Response) {
        const idParam = Number(req.params.id);

        try {
            const result = await episodeService.deleteEpisodeById(idParam);

            if (result) {
                res.status(HttpStatusCode.OK).send({
                    msg: 'Episode deleted successfully',
                });
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'Episode not deleted' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async searchEpisodesByTitle(req: Request, res: Response) {
        const { title, page } = req.query;

        try {
            const episodes = await episodeService.searchEpisodesByTitle(String(title), Number(page));

            if (episodes) {
                res.status(HttpStatusCode.OK).send(episodes);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'Episodes not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
};

export default episodeController;
