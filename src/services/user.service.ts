import { Prisma, Season } from '@prisma/client';
import { prisma } from '../app';
import { User } from '../models/user.model';
import { Genre } from '@/models/genre.model';
import { Episode } from '@/models/episode.model';

interface UserServiceParams {
    sortBy: string;
    ascOrDesc: 'asc' | 'desc';
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: '>' | '=' | '<' | 'gt' | 'equals' | 'lt';
}

const userService = {
    async getUsers({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: UserServiceParams): Promise<User[]> {
        const filters: Prisma.UserWhereInput = {};
        const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
        const take = perPage || 20;

        if (title) filters.userName = { contains: title };

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === '>' ? 'gt' : filterOperatorString === '<' ? 'lt' : 'equals';
            (filters[filterNameString as keyof Prisma.UserWhereInput] as any) = { [operator]: filterValue };
        }

        const orderByObject: any = {};

        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const users = await prisma.user.findMany({
            where: filters,
            orderBy: orderByObject,
            skip,
            take,
            include: {
                favGenres: { select: { genre: true } },
                favMovies: { select: { movie: true } },
                favSeries: { select: { serie: true } },
                favEpisodes: { select: { episode: true } },
                favSeasons: { select: { season: true } },
            },
        });

        return users;
    },
    async getUserById(userId: number): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                favGenres: { select: { genre: true } },
                favMovies: { select: { movie: true } },
                favSeries: { select: { serie: true } },
                favEpisodes: { select: { episode: true } },
                favSeasons: { select: { season: true } },
            },
        });
    },
    async getUserByTitle(title: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { userName: title },
            include: {
                favGenres: { select: { genre: true } },
                favMovies: { select: { movie: true } },
                favSeries: { select: { serie: true } },
                favEpisodes: { select: { episode: true } },
                favSeasons: { select: { season: true } },
            },
        });
    },
    async updateUserById(userParam: Prisma.UserUpdateInput, id: string): Promise<User | null> {
        return await prisma.user.update({
            where: { id: Number(id) },
            data: userParam,
            include: {
                favGenres: { select: { genre: true } },
                favMovies: { select: { movie: true } },
                favSeries: { select: { serie: true } },
                favEpisodes: { select: { episode: true } },
                favSeasons: { select: { season: true } },
            },
        });
    },
    async deleteUserById(id: number): Promise<string | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (user) {
            await prisma.user.delete({
                where: { id },
            });
            return 'User deleted successfully';
        } else {
            return 'User was not deleted';
        }
    },
    async searchUsersByTitle(title: string, page: number): Promise<User[]> {
        return await prisma.user.findMany({
            where: {
                userName: { contains: title },
            },
            include: {
                favGenres: { select: { genre: true } },
                favMovies: { select: { movie: true } },
                favSeries: { select: { serie: true } },
                favEpisodes: { select: { episode: true } },
                favSeasons: { select: { season: true } },
            },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        });
    },
    async addSeasonToUser(userId: number, seasonId: number): Promise<User | null> {
        const season: Season | null = await prisma.season.findUnique({
            where: { id: Number(seasonId) },
        });

        if (season) {
            await prisma.userSeason.update({
                where: { id: Number(seasonId) },
                data: { user: { connect: { id: userId } } },
            });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favGenres: { select: { genre: true } },
                    favMovies: { select: { movie: true } },
                    favSeries: { select: { serie: true } },
                    favEpisodes: { select: { episode: true } },
                    favSeasons: { select: { season: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addSerieToUser(userId: number, serieId: number): Promise<User | null> {
        const serie: Season | null = await prisma.season.findUnique({
            where: { id: Number(serieId) },
        });

        if (serie) {
            await prisma.userSerie.update({
                where: { id: Number(serieId) },
                data: { user: { connect: { id: userId } } },
            });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favGenres: { select: { genre: true } },
                    favMovies: { select: { movie: true } },
                    favSeries: { select: { serie: true } },
                    favEpisodes: { select: { episode: true } },
                    favSeasons: { select: { season: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addGenreToUser(userId: number, genreId: number): Promise<User | null> {
        const genre: Genre | null = await prisma.genre.findUnique({
            where: { id: Number(genreId) },
        });

        if (genre) {
            await prisma.userGenre.update({
                where: { id: Number(genreId) },
                data: { user: { connect: { id: userId } } },
            });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favGenres: { select: { genre: true } },
                    favMovies: { select: { movie: true } },
                    favSeries: { select: { serie: true } },
                    favEpisodes: { select: { episode: true } },
                    favSeasons: { select: { season: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addEpisodeToUser(userId: number, episodeId: number): Promise<User | null> {
        const episode: Episode | null = await prisma.episode.findUnique({
            where: { id: Number(episodeId) },
        });

        if (episode) {
            await prisma.userEpisode.update({
                where: { id: Number(episodeId) },
                data: { user: { connect: { id: userId } } },
            });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favGenres: { select: { genre: true } },
                    favMovies: { select: { movie: true } },
                    favSeries: { select: { serie: true } },
                    favEpisodes: { select: { episode: true } },
                    favSeasons: { select: { season: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
};

export default userService;
