import { prisma } from '../index';
import { Favorite } from '../models/favorite';
import { Movie } from '../models/movie';
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
    async getMoviesByPage({
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
            nrToSkip = (page - 1) * perPage;
        } else {
            nrToSkip = (page - 1) * 20;
        }

        let movies: Movie[] = [];
        let count: number = 0;

        if (!title && !filterValue) {
            movies = await prisma.movie.findMany({
                include: { genres: { include: { genre: true } } },
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
                include: { genres: { include: { genre: true } } },
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
                include: { genres: { include: { genre: true } } },
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
    async getMovies() {
        return await prisma.movie.findMany();
    },
    async getMovieNoPaginationById(movieId: number): Promise<Movie | null> {
        return await prisma.movie.findFirst({
            where: { id: movieId },
            include: { genres: { include: { genre: true } } },
        });
    },
    async getMovieByTitle(title: string): Promise<Movie | null> {
        return await prisma.movie.findFirst({
            where: { title },
            include: { genres: { include: { genre: true } } },
        });
    },
    async getLatestMovies(): Promise<Movie[]> {
        return await prisma.movie.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 20,
            include: { genres: { include: { genre: true } } },
        });
    },
    async getMoviesCount(): Promise<number> {
        const count = await prisma.movie.count();
        return count;
    },
    async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            where: { userId },
        });
    },
    async addFavoriteMovieByUserId(userId: number, movieId: number): Promise<User | null> {
        await prisma.favorite.create({
            data: { userId, movieId },
        });

        const favorites = await prisma.favorite.findMany({
            where: { userId },
        });

        const user: User | null = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                favoriteMovies: {
                    where: { id: { in: favorites.map((f) => f.movieId) } },
                    // @ts-ignore
                    include: { genres: { include: { genre: true } } },
                },
            },
        });

        if (user) {
            return user;
        } else {
            return null;
        }
    },
    async deleteMovieById(id: number): Promise<Movie[]> {
        const movie: Movie | null = await prisma.movie.findUnique({
            where: { id },
        });

        if (movie) {
            await prisma.movie.delete({
                where: { id },
            });

            return await prisma.movie.findMany();
        } else {
            throw new Error('You are not authorized or the movie with this id doesnt exist!');
        }
    },
};

export default movieService;