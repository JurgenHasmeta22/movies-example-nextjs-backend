import { Request, Response } from 'express';
import movieController from '../../src/controllers/movie.controller';
import movieService from '../../src/services/movie.service';

jest.mock('../services/movie.service');
const mockedMovieService = movieService as jest.Mocked<typeof mockedMovieService>;

describe('movieController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMovies', () => {
        it('should return a list of movies', async () => {
            const req = {} as Request;
            const res = { send: jest.fn() } as unknown as Response;
            const mockMovies = [
                { id: 1, title: 'Movie 1' },
                { id: 2, title: 'Movie 2' },
            ];
            const mockCount = 2;

            mockedMovieService.getMovies.mockResolvedValueOnce({ rows: mockMovies, count: mockCount });
            await movieController.getMovies(req, res);
            expect(mockedMovieService.getMovies).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith({ rows: mockMovies, count: mockCount });
        });

        it('should handle errors', async () => {
            const req = {} as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockError = new Error('Internal Server Error');

            mockedMovieService.getMovies.mockRejectedValueOnce(mockError);
            await movieController.getMovies(req, res);
            expect(mockedMovieService.getMovies).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('getMovieById', () => {
        it('should return the requested movie', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response;
            const mockMovie = { id: 1, title: 'Movie 1' };
            mockedMovieService.getMovieById.mockResolvedValueOnce(mockMovie);

            await movieController.getMovieById(req, res);

            expect(mockedMovieService.getMovieById).toHaveBeenCalledWith(1);
            expect(res.send).toHaveBeenCalledWith(mockMovie);
        });

        it('should handle error if movie is not found', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockError = new Error('Movie not found');
            mockedMovieService.getMovieById.mockResolvedValueOnce(null);

            await movieController.getMovieById(req, res);

            expect(mockedMovieService.getMovieById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('getMovieByTitle', () => {
        it('should return the movie with the given title', async () => {
            const req = { params: { title: 'MovieTitle' } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response;
            const mockMovie = { title: 'MovieTitle' };
            mockedMovieService.getMovieByTitle.mockResolvedValueOnce(mockMovie);

            await movieController.getMovieByTitle(req, res);

            expect(mockedMovieService.getMovieByTitle).toHaveBeenCalledWith('MovieTitle');
            expect(res.send).toHaveBeenCalledWith(mockMovie);
        });

        it('should handle error if movie is not found', async () => {
            const req = { params: { title: 'NonExistingMovie' } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockError = new Error('Movie not found');
            mockedMovieService.getMovieByTitle.mockResolvedValueOnce(null);

            await movieController.getMovieByTitle(req, res);

            expect(mockedMovieService.getMovieByTitle).toHaveBeenCalledWith('NonExistingMovie');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('getLatestMovies', () => {
        it('should return the list of latest movies', async () => {
            const req = {} as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response;
            const mockMovies = [{ title: 'Movie1' }, { title: 'Movie2' }];
            mockedMovieService.getLatestMovies.mockResolvedValueOnce(mockMovies);

            await movieController.getLatestMovies(req, res);

            expect(mockedMovieService.getLatestMovies).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockMovies);
        });

        it('should handle error if unable to fetch latest movies', async () => {
            const req = {} as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockError = new Error('Unable to fetch latest movies');
            mockedMovieService.getLatestMovies.mockRejectedValueOnce(mockError);

            await movieController.getLatestMovies(req, res);

            expect(mockedMovieService.getLatestMovies).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('addFavoriteMovieByUser', () => {
        it('should add a favorite movie for a user and return updated user data', async () => {
            const req = { body: { userId: 123, movieId: 456 } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response;
            const mockUpdatedUser = { id: 123, favoriteMovies: [456] };
            mockedMovieService.addFavoriteMovieByUserId.mockResolvedValueOnce(mockUpdatedUser);

            await movieController.addFavoriteMovieByUser(req, res);

            expect(mockedMovieService.addFavoriteMovieByUserId).toHaveBeenCalledWith(123, 456);
            expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
        });

        it('should handle error if unable to add favorite movie for user', async () => {
            const req = { body: { userId: 123, movieId: 456 } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockError = new Error('Unable to add favorite movie');
            mockedMovieService.addFavoriteMovieByUserId.mockRejectedValueOnce(mockError);

            await movieController.addFavoriteMovieByUser(req, res);

            expect(mockedMovieService.addFavoriteMovieByUserId).toHaveBeenCalledWith(123, 456);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('addFavoriteMovieByUser', () => {
        it('should add a favorite movie for a user and return updated user data', async () => {
            const req = { body: { userId: 123, movieId: 456 } } as Request;
            const res = { send: jest.fn() } as unknown as Response<any, Record<string, any>>;
            const mockUpdatedUser = { id: 123, favoriteMovies: [456] };
            mockedMovieService.addFavoriteMovieByUserId.mockResolvedValueOnce(mockUpdatedUser);

            await movieController.addFavoriteMovieByUser(req, res);

            expect(mockedMovieService.addFavoriteMovieByUserId).toHaveBeenCalledWith(123, 456);
            expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
        });

        it('should handle error if unable to add favorite movie for user', async () => {
            const req = { body: { userId: 123, movieId: 456 } } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response<
                any,
                Record<string, any>
            >;
            const mockError = new Error('Unable to add favorite movie');
            mockedMovieService.addFavoriteMovieByUserId.mockRejectedValueOnce(mockError);

            await movieController.addFavoriteMovieByUser(req, res);

            expect(mockedMovieService.addFavoriteMovieByUserId).toHaveBeenCalledWith(123, 456);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('updateMovieById', () => {
        it('should update movie details by ID and return updated movie data', async () => {
            const req = { body: { title: 'Updated Title' }, params: { id: '123' } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response<any, Record<string, any>>;
            const mockUpdatedMovie = { id: 123, title: 'Updated Title' };
            mockedMovieService.updateMovieById.mockResolvedValueOnce(mockUpdatedMovie);

            await movieController.updateMovieById(req, res);

            expect(mockedMovieService.updateMovieById).toHaveBeenCalledWith({ title: 'Updated Title' }, '123');
            expect(res.send).toHaveBeenCalledWith(mockUpdatedMovie);
        });

        it('should handle error if unable to update movie by ID', async () => {
            const req = { body: { title: 'Updated Title' }, params: { id: '123' } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response<
                any,
                Record<string, any>
            >;
            const mockError = new Error('Unable to update movie');
            mockedMovieService.updateMovieById.mockRejectedValueOnce(mockError);

            await movieController.updateMovieById(req, res);

            expect(mockedMovieService.updateMovieById).toHaveBeenCalledWith({ title: 'Updated Title' }, '123');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('addMovie', () => {
        it('should add a new movie and return the created movie data', async () => {
            const req = { body: { title: 'New Movie' } } as Request;
            const res = { send: jest.fn() } as unknown as Response<any, Record<string, any>>;
            const mockCreatedMovie = { id: 123, title: 'New Movie' };
            mockedMovieService.addMovie.mockResolvedValueOnce(mockCreatedMovie);

            await movieController.addMovie(req, res);

            expect(mockedMovieService.addMovie).toHaveBeenCalledWith({ title: 'New Movie' });
            expect(res.send).toHaveBeenCalledWith(mockCreatedMovie);
        });

        it('should handle error if unable to add a new movie', async () => {
            const req = { body: { title: 'New Movie' } } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response<
                any,
                Record<string, any>
            >;
            const mockError = new Error('Unable to add movie');
            mockedMovieService.addMovie.mockRejectedValueOnce(mockError);

            await movieController.addMovie(req, res);

            expect(mockedMovieService.addMovie).toHaveBeenCalledWith({ title: 'New Movie' });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('deleteMovieById', () => {
        it('should delete a movie by ID and return success message', async () => {
            const req = { params: { id: '123' } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response<any, Record<string, any>>;
            mockedMovieService.deleteMovieById.mockResolvedValueOnce('Movie deleted successfully');

            await movieController.deleteMovieById(req, res);

            expect(mockedMovieService.deleteMovieById).toHaveBeenCalledWith(123);
            expect(res.send).toHaveBeenCalledWith({ msg: 'Movie deleted successfully' });
        });

        it('should handle error if unable to delete movie by ID', async () => {
            const req = { params: { id: '123' } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response<
                any,
                Record<string, any>
            >;
            const mockError = new Error('Unable to delete movie');
            mockedMovieService.deleteMovieById.mockRejectedValueOnce(mockError);

            await movieController.deleteMovieById(req, res);

            expect(mockedMovieService.deleteMovieById).toHaveBeenCalledWith(123);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('searchMoviesByTitle', () => {
        it('should search movies by title and return matching movies', async () => {
            const req = { query: { title: 'Inception', page: '1' } } as unknown as Request;
            const res = { send: jest.fn() } as unknown as Response<any, Record<string, any>>;
            const mockMovies = [{ id: 123, title: 'Inception' }];
            mockedMovieService.searchMoviesByTitle.mockResolvedValueOnce({ movies: mockMovies, count: 1 });

            await movieController.searchMoviesByTitle(req, res);

            expect(mockedMovieService.searchMoviesByTitle).toHaveBeenCalledWith('Inception', 1);
            expect(res.send).toHaveBeenCalledWith({ movies: mockMovies, count: 1 });
        });

        it('should handle error if unable to search movies by title', async () => {
            const req = { query: { title: 'Inception', page: '1' } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response<
                any,
                Record<string, any>
            >;
            const mockError = new Error('Unable to search movies');
            mockedMovieService.searchMoviesByTitle.mockRejectedValueOnce(mockError);

            await movieController.searchMoviesByTitle(req, res);

            expect(mockedMovieService.searchMoviesByTitle).toHaveBeenCalledWith('Inception', 1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
        });
    });
});
