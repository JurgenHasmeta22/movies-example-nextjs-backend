import { prisma } from '../app';
import { Prisma } from '@prisma/client';
import { Genre } from '../models/genre.model';

interface GetGenresParams {
    sortBy: string;
    ascOrDesc: 'asc' | 'desc';
    perPage: number;
    page: number;
    name: string;
    filterValue?: number;
    filterNameString: string;
    filterOperatorString: '>' | '=' | '<';
}

const genreService = {
    async getGenres({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        name,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: GetGenresParams): Promise<Genre[]> {
        const filters: any = {};
        const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
        const take = perPage || 20;

        if (name) filters.name = { contains: name };

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === '>' ? 'gt' : filterOperatorString === '<' ? 'lt' : 'equals';
            filters[filterNameString] = { [operator]: filterValue };
        }

        const orderByObject: any = {};

        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const genres = await prisma.genre.findMany({
            where: filters,
            include: { movies: { select: { movie: true } } },
            orderBy: orderByObject,
            skip,
            take,
        });

        return genres;
    },
    async getGenreById(id: number): Promise<Genre | null> {
        return await prisma.genre.findUnique({
            where: {
                id,
            },
            include: {
                movies: {
                    select: {
                        movie: true,
                    },
                },
            },
        });
    },
    async getGenreByName(name: string): Promise<Genre | null> {
        return await prisma.genre.findFirst({
            where: {
                name,
            },
            include: {
                movies: {
                    select: {
                        movie: true,
                    },
                },
            },
        });
    },
    async addGenre(genreData: Prisma.GenreCreateInput): Promise<Genre | null> {
        return await prisma.genre.create({
            data: genreData,
            include: {
                movies: {
                    select: {
                        movie: true,
                    },
                },
            },
        });
    },
    async updateGenreById(genreData: Prisma.GenreUpdateInput, id: string): Promise<Genre | null> {
        return await prisma.genre.update({
            where: {
                id: parseInt(id),
            },
            data: genreData,
            include: {
                movies: {
                    select: {
                        movie: true,
                    },
                },
            },
        });
    },
    async deleteGenreById(id: number): Promise<string> {
        try {
            await prisma.genre.delete({
                where: {
                    id,
                },
            });

            return 'Genre deleted successfully';
        } catch (error) {
            throw new Error('Failed to delete genre');
        }
    },
    async searchGenresByName(name: string, page: number): Promise<Genre[]> {
        const perPage = 20;
        const skip = perPage * (page - 1);
        const genres = await prisma.genre.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
            orderBy: {
                name: 'asc',
            },
            skip,
            take: perPage,
            include: {
                movies: {
                    select: {
                        movie: true,
                    },
                },
            },
        });

        return genres;
    },
};

export default genreService;
