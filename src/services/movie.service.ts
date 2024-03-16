import { Movie, Prisma } from '@prisma/client';
import { prisma } from '../app';

interface MovieServiceParams {
    sortBy: string;
    ascOrDesc: 'asc' | 'desc';
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: '>' | '=' | '<' | 'gt' | 'equals' | 'lt';
}

const movieService = {
    async getMovies({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: MovieServiceParams): Promise<Movie[] | null> {
        const filters: any = {};
        const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
        const take = perPage || 20;

        if (title) filters.title = { contains: title };

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === '>' ? 'gt' : filterOperatorString === '<' ? 'lt' : 'equals';
            filters[filterNameString] = { [operator]: filterValue };
        }

        const orderByObject: any = {};

        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const movies = await prisma.movie.findMany({
            where: filters,
            include: { genres: { select: { genre: true } } },
            orderBy: orderByObject,
            skip,
            take,
        });

        if (movies) {
            return movies;
        } else {
            return null;
        }
    },
    async getMovieById(movieId: number): Promise<Movie | null> {
        const result = await prisma.movie.findFirst({
            where: { id: movieId },
            include: { genres: { select: { genre: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getMovieByTitle(title: string): Promise<Movie | null> {
        const result = await prisma.movie.findFirst({
            where: { title },
            include: { genres: { select: { genre: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getLatestMovies(): Promise<Movie[] | null> {
        const result = await prisma.movie.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 20,
            include: { genres: { select: { genre: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async updateMovieById(movieParam: Prisma.MovieUpdateInput, id: string): Promise<Movie | null> {
        const movie: Movie | null = await prisma.movie.findUnique({
            where: { id: Number(id) },
        });

        if (movie) {
            const movieUpdated = await prisma.movie.update({
                where: { id: Number(id) },
                data: movieParam,
                include: { genres: { select: { genre: true } } },
            });

            if (movieUpdated) {
                return movieUpdated;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addMovie(movieParam: Prisma.MovieCreateInput): Promise<Movie | null> {
        const movieCreated = await prisma.movie.create({
            data: movieParam,
            include: { genres: { select: { genre: true } } },
        });

        if (movieCreated) {
            return movieCreated;
        } else {
            return null;
        }
    },
    async deleteMovieById(id: number): Promise<string | null> {
        const movie: Movie | null = await prisma.movie.findUnique({
            where: { id },
        });

        if (movie) {
            const result = await prisma.movie.delete({
                where: { id },
            });

            if (result) {
                return 'Movie deleted successfully';
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async searchMoviesByTitle(title: string, page: number): Promise<Movie[] | null> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { genres: { select: { genre: true } } },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const movies = await prisma.movie.findMany(query);

        if (movies) {
            return movies;
        } else {
            return null;
        }
    },
};

export default movieService;
