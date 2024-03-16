import { prisma } from '../app';
import { Movie, MoviePatch, MoviePost } from '../models/movie.model';

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
    }: MovieServiceParams): Promise<Movie[]> {
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

        return movies;
    },
    async getMovieById(movieId: number): Promise<Movie | null> {
        return await prisma.movie.findFirst({
            where: { id: movieId },
            include: { genres: { select: { genre: true } } },
        });
    },
    async getMovieByTitle(title: string): Promise<Movie | null> {
        return await prisma.movie.findFirst({
            where: { title },
            include: { genres: { select: { genre: true } } },
        });
    },
    async getLatestMovies(): Promise<Movie[]> {
        return await prisma.movie.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 20,
            include: { genres: { select: { genre: true } } },
        });
    },
    async updateMovieById(movieParam: MoviePatch, id: string): Promise<Movie | null> {
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
    async addMovie(movieParam: MoviePost): Promise<Movie | null> {
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
                return 'Movie was not deleted';
            }
        } else {
            return null;
        }
    },
    async searchMoviesByTitle(title: string, page: number): Promise<Movie[]> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { genres: { select: { genre: true } } },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const movies = await prisma.movie.findMany(query);
        return movies;
    },
};

export default movieService;
