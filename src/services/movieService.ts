import { prisma } from '../index';
import { Favorite } from '../models/favorite';
import { Movie, MoviePatch, MoviePost } from '../models/movie';
import { User } from '../models/user';

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

interface MovieServiceResponse {
    rows: Movie[];
    count: number;
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
    }: MovieServiceParams): Promise<MovieServiceResponse> {
        let filterValueString: number | string = String(filterValue);

        if (typeof filterValueString === 'string' && filterValueString.match(/\d+/g) != null) {
            filterValueString = Number(filterValueString);
        }

        if (filterOperatorString === '>') {
            filterOperatorString = 'gt';
        } else if (filterOperatorString === '=') {
            filterOperatorString = 'equals';
        } else if (filterOperatorString === '<') {
            filterOperatorString = 'lt';
        }

        let nrToSkip: number;

        if (perPage) {
            nrToSkip = page ? (page - 1) * perPage : 0;
        } else {
            nrToSkip = page ? (page - 1) * 20 : 0;
        }

        let movies: Movie[] = [];
        let count: number = 0;

        if (!title && !filterValue) {
            movies = await prisma.movie.findMany({
                include: { genres: { select: { genre: true } } },
                orderBy: {
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });

            count = await prisma.movie.count();
        } else if (title && !filterValue) {
            movies = await prisma.movie.findMany({
                where: {
                    title: { contains: title },
                },
                include: { genres: { select: { genre: true } } },
                orderBy: {
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });

            count = await prisma.movie.count({
                where: {
                    title: { contains: title },
                },
            });
        } else if (!title && filterValue) {
            movies = await prisma.movie.findMany({
                where: {
                    [filterNameString && filterNameString.length > 0 ? filterNameString : '']: {
                        [filterOperatorString && filterOperatorString.length > 0 ? filterOperatorString : 'equals']:
                            filterValueString,
                    },
                },
                include: { genres: { select: { genre: true } } },
                orderBy: {
                    [sortBy]: ascOrDesc,
                },
                skip: nrToSkip,
                take: perPage ? perPage : 20,
            });

            count = await prisma.movie.count({
                where: {
                    [filterNameString && filterNameString.length > 0 ? filterNameString : '']: {
                        [filterOperatorString && filterOperatorString.length > 0 ? filterOperatorString : 'equals']:
                            filterValueString,
                    },
                },
            });
        }

        return { rows: movies, count };
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
    async addFavoriteMovieByUserId(userId: number, movieId: number): Promise<User | null> {
        await prisma.favorite.create({
            data: { userId, movieId },
        });

        const user: User | null = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                favMovies: {
                    select: {
                        movie: {
                            include: {
                                genres: {
                                    select: { genre: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (user) {
            return user;
        } else {
            return null;
        }
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
    async searchMoviesByTitle(title: string, page: number): Promise<{ movies: Movie[]; count: number }> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { genres: { select: { genre: true } } },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const movies = await prisma.movie.findMany(query);
        const count = await prisma.movie.count({
            where: {
                title: { contains: title },
            },
        });

        return { movies, count };
    },
};

export default movieService;
