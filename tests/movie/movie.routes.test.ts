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
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .query({ sortBy, ascOrDesc, filterName, filterValue, page, pageSize });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.rows)).toBe(true);

            const movies = response.body.rows;

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
                .query({ sortBy, ascOrDesc, filterName, filterValue, page, pageSize });
            expect(response.status).toBe(401);
        });
    });

    describe('GET /movies/:id', () => {
        test('Should return status 200 and the requested movie', async () => {
            const movieId = 324;
            const response = await request(app).get(`/movies/${movieId}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(movieId);
        });

        test('Should return 401 status code if not authorized', async () => {
            const movieId = 324;
            const response = await request(app).get(`/movies/${movieId}`);
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
            const movieId = 323;
            const response = await request(app)
                .delete(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                );

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Movie was deleted');
        });

        test('Should return status 400 and a error message', async () => {
            const movieId = 323;
            const response = await request(app)
                .delete(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                );
            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Movie was not deleted');
        });

        test('Should return 401 status code if not authorized', async () => {
            const movieId = 323;
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
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(validMovieData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(validMovieData);
        });

        it('should return status 400 if adding a new movie with missing required fields', async () => {
            const invalidMovieData = {};
            const response = await request(app)
                .post('/movies')
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(invalidMovieData);

            expect(response.status).toBe(400);
        });

        it('should return status 401 if not authorized', async () => {
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
            const response = await request(app).post('/movies').send(validMovieData);
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /movies/:id', () => {
        it('should update an existing movie with valid data', async () => {
            const movieId = 323;
            const updatedMovieData = {
                title: 'Inception 2',
                videoSrc: 'https://example.com/video_updated.mp4',
                photoSrc: 'https://example.com/photo_updated.jpg',
                trailerSrc: 'https://example.com/trailer_updated.mp4',
                duration: '150 minutes',
                ratingImdb: 9.0,
                releaseYear: 2011,
                description: 'A sequel to the original Inception movie.',
                views: 1500000,
            };

            const response = await request(app)
                .put(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(updatedMovieData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedMovieData);
        });

        it('should return status 404 if updating a movie that does not exist', async () => {
            const movieId = 9999;
            const updatedMovieData = {
                title: 'Inception 2',
                videoSrc: 'https://example.com/video_updated.mp4',
                photoSrc: 'https://example.com/photo_updated.jpg',
                trailerSrc: 'https://example.com/trailer_updated.mp4',
                duration: '150 minutes',
                ratingImdb: 9.0,
                releaseYear: 2011,
                description: 'A sequel to the original Inception movie.',
                views: 1500000,
            };

            const response = await request(app)
                .put(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(updatedMovieData);

            expect(response.status).toBe(404);
        });

        it('should return status 401 if not authorized', async () => {
            const movieId = 323;
            const updatedMovieData = {
                title: 'Inception 2',
                videoSrc: 'https://example.com/video_updated.mp4',
                photoSrc: 'https://example.com/photo_updated.jpg',
                trailerSrc: 'https://example.com/trailer_updated.mp4',
                duration: '150 minutes',
                ratingImdb: 9.0,
                releaseYear: 2011,
                description: 'A sequel to the original Inception movie.',
                views: 1500000,
            };

            const response = await request(app).put(`/movies/${movieId}`).send(updatedMovieData);

            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /movies/:id', () => {
        test('should return status 200 and the updated movie', async () => {
            const movieId = 324;
            const updatedMovieData = {
                title: 'Inception Updated',
            };
            const response = await request(app)
                .patch(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(updatedMovieData);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedMovieData.title);
        });

        test('should return status 400 if patch is not made', async () => {
            const movieId = 32400;
            const updatedMovieData = {
                title: 'Updated Movie Title',
                photoSrc: 'Updated photo source',
            };

            const response = await request(app)
                .patch(`/movies/${movieId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(updatedMovieData);
            expect(response.status).toBe(400);
        });

        test('should return status 401 if not authorized', async () => {
            const movieId = 324;
            const updatedMovieData = {
                title: 'Inception Updated',
            };
            const response = await request(app).patch(`/movies/${movieId}`).send(updatedMovieData);
            expect(response.status).toBe(401);
        });
    });

    describe('GET /searchMovies', () => {
        it('should return status 200 and list of movies matching the title', async () => {
            const searchTitle = 'Goku';
            const response = await request(app)
                .get(`/searchMovies?title=${encodeURIComponent(searchTitle)}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.movies)).toBe(true);
            expect(
                response.body.movies.every((movie: any) =>
                    movie.title.toLowerCase().includes(searchTitle.toLowerCase()),
                ),
            ).toBe(true);
        });

        it('should return status 401 if not authorized', async () => {
            const searchTitle = 'Goku';
            const response = await request(app).get(`/searchMovies?title=${encodeURIComponent(searchTitle)}`);
            expect(response.status).toBe(401);
        });
    });

    describe('GET /latestMovies', () => {
        it('should return status 200 and list of latest movies', async () => {
            const response = await request(app)
                .get('/latestMovies')
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return status 401 if not authorized', async () => {
            const response = await request(app).get('/latestMovies');
            expect(response.status).toBe(401);
        });
    });

    describe('POST /favoritesMovies', () => {
        test('should return status 200 and updated user with favorite movie', async () => {
            const movieId = 20;
            const userId = 14;
            const requestBody = { movieId, userId };
            const response = await request(app)
                .post('/favoritesMovies')
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(requestBody);
            expect(response.status).toBe(200);
            expect(response.body.favMovies.some((favMovie: any) => favMovie.id === movieId)).toBe(true);
        });

        test('should return status 400 if error ocurred', async () => {
            const movieId = 20;
            const userId = 14;
            const requestBody = { movieId, userId };
            const response = await request(app)
                .post('/favoritesMovies')
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDQ1MjQ2NywiZXhwIjoxNzEwNTM4ODY3fQ.C9sfWe-nESclem5hivcDVa1QcTwxqnye11NqLMfED_k`,
                )
                .send(requestBody);
            expect(response.status).toBe(400);
        });

        test('should return status 401 if not authorized', async () => {
            const response = await request(app).post('/favoritesMovies');
            expect(response.status).toBe(401);
        });
    });
});
