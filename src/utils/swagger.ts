export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movies API',
            version: '1.0.0',
            description: 'Movies API',
        },
        servers: [
            {
                url: 'http://localhost:4000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                },
            },
            schemas: {
                Movie: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the movie',
                        },
                        title: {
                            type: 'string',
                            description: 'The movie title',
                        },
                        videoSrc: {
                            type: 'string',
                            description: 'The video source of the movie',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the movie',
                        },
                        trailerSrc: {
                            type: 'string',
                            description: 'The trailer source of the movie',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the movie',
                        },
                        ratingImdb: {
                            type: 'string',
                            description: 'The rating of the movie',
                        },
                        releaseYear: {
                            type: 'string',
                            description: 'The release year of the movie',
                        },
                        description: {
                            type: 'string',
                            description: 'The description of the movie',
                        },
                        views: {
                            type: 'string',
                            description: 'The views of the movie',
                        },
                        genres: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Genre',
                            },
                            description: 'The genres of the movie',
                        },
                    },
                    example: {
                        id: 'abc123',
                        title: 'Inception',
                        director: 'Christopher Nolan',
                        genre: 'Science Fiction',
                        releaseYear: '2010',
                        rating: '8.8',
                        duration: '148 minutes',
                        description: 'A thief who enters the dreams of others to steal their secrets.',
                        views: '1000000',
                        genres: [
                            {
                                id: 1,
                                name: 'Science Fiction',
                            },
                            {
                                id: 2,
                                name: 'Action',
                            },
                        ],
                    },
                },
                MoviePost: {
                    type: 'object',
                    required: [
                        'title',
                        'videoSrc',
                        'photoSrc',
                        'trailerSrc',
                        'duration',
                        'ratingImdb',
                        'releaseYear',
                        'description',
                        'views',
                    ],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The movie title',
                        },
                        videoSrc: {
                            type: 'string',
                            description: 'The video source of the movie',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the movie',
                        },
                        trailerSrc: {
                            type: 'string',
                            description: 'The trailer source of the movie',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the movie',
                        },
                        ratingImdb: {
                            type: 'string',
                            description: 'The rating of the movie',
                        },
                        releaseYear: {
                            type: 'string',
                            description: 'The release year of the movie',
                        },
                        description: {
                            type: 'string',
                            description: 'The description of the movie',
                        },
                        views: {
                            type: 'string',
                            description: 'The views of the movie',
                        },
                    },
                    example: {
                        title: 'Inception',
                        director: 'Christopher Nolan',
                        genre: 'Science Fiction',
                        releaseYear: '2010',
                        rating: '8.8',
                        duration: '148 minutes',
                        description: 'A thief who enters the dreams of others to steal their secrets.',
                        views: '1000000',
                    },
                },
                MoviePatch: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The movie title',
                        },
                        videoSrc: {
                            type: 'string',
                            description: 'The video source of the movie',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the movie',
                        },
                        trailerSrc: {
                            type: 'string',
                            description: 'The trailer source of the movie',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the movie',
                        },
                        ratingImdb: {
                            type: 'string',
                            description: 'The rating of the movie',
                        },
                        releaseYear: {
                            type: 'string',
                            description: 'The release year of the movie',
                        },
                        description: {
                            type: 'string',
                            description: 'The description of the movie',
                        },
                        views: {
                            type: 'string',
                            description: 'The views of the movie',
                        },
                    },
                    example: {
                        title: 'Inception',
                        director: 'Christopher Nolan',
                        genre: 'Science',
                        releaseYear: '2010',
                        rating: '8.8',
                        duration: '148 minutes',
                    },
                },
                Favorite: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the favorite',
                        },
                        userId: {
                            type: 'number',
                            description: 'The id of the user who favorited the movie',
                        },
                        movieId: {
                            type: 'number',
                            description: 'The id of the favorite movie',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                            description: 'The user who favorited the movie',
                        },
                        movie: {
                            $ref: '#/components/schemas/Movie',
                            description: 'The favorite movie',
                        },
                    },
                    example: {
                        id: 1,
                        userId: 123,
                        movieId: 456,
                        user: {
                            id: 123,
                            username: 'user1',
                            email: 'user1@example.com',
                        },
                        movie: {
                            id: 'abc123',
                            title: 'Inception',
                            director: 'Christopher Nolan',
                            genre: 'Science Fiction',
                            releaseYear: '2010',
                            rating: '8.8',
                            duration: '148 minutes',
                            description: 'A thief who enters the dreams of others to steal their secrets.',
                            views: '1000000',
                        },
                    },
                },
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    apis: ['./src/routes/*.ts'],
};
