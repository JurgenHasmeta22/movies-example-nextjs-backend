import { Request, Response } from 'express';
import userService from '../services/user.service';
import { User } from '@prisma/client';
import HttpStatusCode from '../utils/httpStatusCodes';

const userController = {
    async getUsers(req: Request, res: Response) {
        const { sortBy, ascOrDesc, page, pageSize, userName, filterValue, filterName, filterOperator } = req.query;

        try {
            const users = await userService.getUsers({
                sortBy: sortBy as string,
                ascOrDesc: ascOrDesc as 'asc' | 'desc',
                perPage: pageSize ? Number(pageSize) : 20,
                page: Number(page),
                userName: userName as string,
                filterValue: filterValue ? Number(filterValue) : undefined,
                filterNameString: filterName as string,
                filterOperatorString: filterOperator as '>' | '=' | '<',
            });

            if (users) {
                res.status(HttpStatusCode.OK).send(users);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async getUserById(req: Request, res: Response) {
        const userId = Number(req.params.id);

        try {
            const user = await userService.getUserById(userId);

            if (user) {
                res.status(HttpStatusCode.OK).send(user);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async getUserByTitle(req: Request, res: Response) {
        const title = req.params.title
            .split('')
            .map((char) => (char === '-' ? ' ' : char))
            .join('');
        try {
            const user = await userService.getUserByUsername(title);

            if (user) {
                res.status(HttpStatusCode.OK).send(user);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'User not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async updateUserById(req: Request, res: Response) {
        const userBodyParams = req.body;
        const { id } = req.params;

        try {
            const user: User | null = await userService.updateUserById(userBodyParams, id);

            if (user) {
                res.status(HttpStatusCode.OK).send(user);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async deleteUserById(req: Request, res: Response) {
        const idParam = Number(req.params.id);

        try {
            const result = await userService.deleteUserById(idParam);

            if (result) {
                res.status(HttpStatusCode.OK).send({
                    msg: 'User deleted successfully',
                });
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User not deleted' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async searchUsersByTitle(req: Request, res: Response) {
        const { title, page } = req.query;

        try {
            const users = await userService.searchUsersByUsername(String(title), Number(page));

            if (users) {
                res.status(HttpStatusCode.OK).send(users);
            } else {
                res.status(HttpStatusCode.NotFound).send({ error: 'Users not found' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addSeasonToUser(req: Request, res: Response) {
        const { userId, seasonId } = req.body;

        try {
            const updatedUser = await userService.addSeasonToUser(userId, seasonId);

            if (updatedUser) {
                res.status(HttpStatusCode.OK).send(updatedUser);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User with new season not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addSerieToUser(req: Request, res: Response) {
        const { userId, serieId } = req.body;

        try {
            const updatedUser = await userService.addSerieToUser(userId, serieId);

            if (updatedUser) {
                res.status(HttpStatusCode.OK).send(updatedUser);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User with new serie not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addEpisodeToUser(req: Request, res: Response) {
        const { userId, episodeId } = req.body;

        try {
            const updatedUser = await userService.addEpisodeToUser(userId, episodeId);

            if (updatedUser) {
                res.status(HttpStatusCode.OK).send(updatedUser);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User with new episode not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addGenreToUser(req: Request, res: Response) {
        const { userId, genreId } = req.body;

        try {
            const updatedUser = await userService.addGenreToUser(userId, genreId);

            if (updatedUser) {
                res.status(HttpStatusCode.OK).send(updatedUser);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'User with new genre not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
    async addMovieToUser(req: Request, res: Response) {
        const { movieId, userId } = req.body;

        try {
            const updatedUser = await userService.addMovieToUser(userId, movieId);

            if (updatedUser) {
                res.status(HttpStatusCode.OK).send(updatedUser);
            } else {
                res.status(HttpStatusCode.Conflict).send({ error: 'Favorites movies not updated' });
            }
        } catch (err) {
            res.status(HttpStatusCode.BadRequest).send({ error: (err as Error).message });
        }
    },
};

export default userController;
