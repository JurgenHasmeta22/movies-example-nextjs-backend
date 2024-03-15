import request from 'supertest';
import { app } from '../../src/app';

describe('Movie Routes', () => {
    describe('GET /movies with pagination, sorting, and filtering parameters', () => {
        it('should return status 200 and list of movies sorted by release year in ascending order, filtered by title, and paginated', async () => {
            const sortBy = 'releaseYear';
            const ascOrDesc = 'asc';
            const filterName = 'title';
            const filterValue = 'Inception';
            const page = 1;
            const pageSize = 10;
            const response = await request(app)
                .get('/movies')
                .set('Authorization', `Bearer 096hjfk`)
                .query({ sortBy, ascOrDesc, filterName, filterValue, page, pageSize });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const movies = response.body;

            for (let i = 0; i < movies.length - 1; i++) {
                expect(movies[i].releaseYear <= movies[i + 1].releaseYear).toBe(true);
            }

            for (const movie of movies) {
                expect(movie.title.toLowerCase()).toContain(filterValue.toLowerCase());
            }

            expect(movies.length).toBeLessThanOrEqual(pageSize);
        });

        test('Should return 401 status code if not authorized', async () => {
            const sortBy = 'releaseYear';
            const ascOrDesc = 'asc';
            const filterName = 'title';
            const filterValue = 'Inception';
            const page = 1;
            const pageSize = 10;
            const response = await request(app)
                .get('/movies')
                .set('Authorization', `Bearer 096hjfk`)
                .query({ sortBy, ascOrDesc, filterName, filterValue, page, pageSize });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /movies/:id', () => {
        test('Should return status 200 and the requested movie', async () => {
            const movieId = 5;
            const response = await request(app).get(`/movies/${movieId}`).set('Authorization', `Bearer jokf`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(movieId);
        });

        test('Should return 401 status code if not authorized', async () => {
            const movieId = 5;
            const response = await request(app).get(`/movies/${movieId}`).set('Authorization', `Bearer jokf`);

            expect(response.status).toBe(401);
        });
    });

    describe('GET /movies/:title', () => {
        test('Should return status 200 and the movie with the given title', async () => {
            const movieTitle = 'Goku';
            const response = await request(app)
                .get(`/movies/${encodeURIComponent(movieTitle)}`)
                .set('Authorization', `Bearer jokf`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(movieTitle);
        });

        test('Should return 401 status code if not authorized', async () => {
            const movieTitle = 'Goku';
            const response = await request(app).get(`/movies/${encodeURIComponent(movieTitle)}`);

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /movies/:id', () => {
        test('Should return status 200 and a success message', async () => {
            const movieId = 320;
            const response = await request(app).delete(`/movies/${movieId}`).set('Authorization', `Bearer jokf`);

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Movie deleted successfully');
        });

        test('Should return 401 status code if not authorized', async () => {
            const movieId = 320;
            const response = await request(app).delete(`/movies/${movieId}`);

            expect(response.status).toBe(401);
        });
    });

    describe('POST /movies', () => {
        it('should add a new movie with valid data', async () => {
            const validMovieData = {
                title: 'Inception',
                videoSrc: 'https://example.com/video.mp4',
                photoSrc: 'https://example.com/photo.jpg',
                trailerSrc: 'https://example.com/trailer.mp4',
                duration: '148 minutes',
                ratingImdb: 8.8,
                releaseYear: 2010,
                description: 'A thief who enters the dreams of others to steal their secrets.',
                views: 1000000,
            };
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer jokf`)
                .send(validMovieData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(validMovieData);
        });

        it('should return status 400 if adding a new movie with missing required fields', async () => {
            const invalidMovieData = {};
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer jokf`)
                .send(invalidMovieData);

            expect(response.status).toBe(400);
        });

        it('should return status 400 if adding a new movie with invalid field types', async () => {
            const invalidMovieData = {
                title: 'Inception',
                videoSrc: 'not a valid URL',
                photoSrc: 'https://example.com/photo.jpg',
                trailerSrc: 'https://example.com/trailer.mp4',
                duration: 148,
                ratingImdb: '8.8',
                releaseYear: '2010',
                description: 'A thief who enters the dreams of others to steal their secrets.',
                views: '1000000',
            };
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer jokf`)
                .send(invalidMovieData);

            expect(response.status).toBe(400);
        });

        test('Should return 401 status code if not authorized', async () => {
            const validMovieData = {
                title: 'Inception',
                videoSrc: 'https://example.com/video.mp4',
                photoSrc: 'https://example.com/photo.jpg',
                trailerSrc: 'https://example.com/trailer.mp4',
                duration: '148 minutes',
                ratingImdb: 8.8,
                releaseYear: 2010,
                description: 'A thief who enters the dreams of others to steal their secrets.',
                views: 1000000,
            };
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer jokf`)
                .send(validMovieData);

            expect(response.status).toBe(401);
        });
    });

    test('PUT /movies/:id should return status 200 and updated movie details', async () => {
        const movieId = 5;
        const updatedMovieData = {
            title: 'Updated Movie Title',
            videoSrc: 'Updated video source',
            photoSrc: 'Updated photo source',
            trailerSrc: 'Updated trailer source',
            duration: 'Updated duration',
            ratingImdb: 9.5,
            releaseYear: 2022,
            description: 'Updated movie description',
            views: 1000,
        };

        const response = await request(app)
            .put(`/movies/${movieId}`)
            .set('Authorization', `Bearer 096hjfk`)
            .send(updatedMovieData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', updatedMovieData.title);
        expect(response.body).toHaveProperty('videoSrc', updatedMovieData.videoSrc);
        expect(response.body).toHaveProperty('photoSrc', updatedMovieData.photoSrc);
        expect(response.body).toHaveProperty('trailerSrc', updatedMovieData.trailerSrc);
        expect(response.body).toHaveProperty('duration', updatedMovieData.duration);
        expect(response.body).toHaveProperty('ratingImdb', updatedMovieData.ratingImdb);
        expect(response.body).toHaveProperty('releaseYear', updatedMovieData.releaseYear);
        expect(response.body).toHaveProperty('description', updatedMovieData.description);
        expect(response.body).toHaveProperty('views', updatedMovieData.views);
    });

    test('PATCH /movies/:id should return status 200 and the updated movie', async () => {
        const movieId = 5;
        const updatedMovieData = {
            title: 'Inception Updated',
        };
        const response = await request(app)
            .patch(`/movies/${movieId}`)
            .set('Authorization', `Bearer 096hjfk`)
            .send(updatedMovieData);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedMovieData.title);
    });

    test('GET /searchMovies should return status 200 and list of movies matching the title', async () => {
        const searchTitle = 'Goku';
        const response = await request(app)
            .get(`/searchMovies?title=${encodeURIComponent(searchTitle)}`)
            .set('Authorization', `Bearer 096hjfk`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.movies)).toBe(true);
        expect(
            response.body.movies.every((movie: any) => movie.title.toLowerCase().includes(searchTitle.toLowerCase())),
        ).toBe(true);
    });

    test('GET /latestMovies should return status 200 and list of latest movies', async () => {
        const response = await request(app).get('/latestMovies').set('Authorization', `Bearer 096hjfk`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /favoritesMovies should return status 200 and updated user with favorite movie', async () => {
        const movieId = 5;
        const userId = 14;
        const requestBody = { movieId, userId };
        const response = await request(app)
            .post('/favoritesMovies')
            .set('Authorization', `Bearer 096hjfk`)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.favMovies.some((favMovie: any) => favMovie.id === movieId)).toBe(true);
    });
});
