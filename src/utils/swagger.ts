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
                Genre: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the genre',
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the genre',
                        },
                        movies: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/MovieGenre',
                            },
                            description: 'The movies associated with the genre',
                        },
                    },
                    example: {
                        id: 1,
                        name: 'Action',
                        movies: [
                            {
                                id: 1,
                                movieId: 123,
                                genreId: 1,
                                movie: {
                                    id: 123,
                                    title: 'Terminator',
                                    director: 'James Cameron',
                                    genre: 'Action',
                                    releaseYear: 1984,
                                    rating: 8.0,
                                    duration: '107 minutes',
                                    description: 'A cyborg assassin is sent back in time to kill Sarah Connor.',
                                    views: 1000000,
                                },
                            },
                        ],
                    },
                },
                GenrePost: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the genre',
                        },
                    },
                    example: {
                        name: 'Action',
                    },
                },
                GenrePatch: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the genre',
                        },
                    },
                    example: {
                        name: 'Sci-Fi',
                    },
                },
                MovieGenre: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the movie-genre association',
                        },
                        movieId: {
                            type: 'number',
                            description: 'The id of the movie associated with the genre',
                        },
                        genreId: {
                            type: 'number',
                            description: 'The id of the genre associated with the movie',
                        },
                        movie: {
                            $ref: '#/components/schemas/Movie',
                            description: 'The movie associated with the genre',
                        },
                        genre: {
                            $ref: '#/components/schemas/Genre',
                            description: 'The genre associated with the movie',
                        },
                    },
                    example: {
                        id: 1,
                        movieId: 123,
                        genreId: 1,
                        movie: {
                            id: 123,
                            title: 'Terminator',
                            director: 'James Cameron',
                            genre: 'Action',
                            releaseYear: 1984,
                            rating: 8.0,
                            duration: '107 minutes',
                            description: 'A cyborg assassin is sent back in time to kill Sarah Connor.',
                            views: 1000000,
                        },
                        genre: {
                            id: 1,
                            name: 'Action',
                        },
                    },
                },
                Serie: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the series',
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the series',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the series',
                        },
                        releaseYear: {
                            type: 'number',
                            description: 'The release year of the series',
                        },
                        ratingImdb: {
                            type: 'number',
                            description: 'The IMDb rating of the series',
                        },
                        episodes: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Episode',
                            },
                            description: 'The episodes of the series',
                        },
                    },
                    example: {
                        id: 1,
                        title: 'Game of Thrones',
                        photoSrc: 'https://example.com/game-of-thrones.jpg',
                        releaseYear: 2011,
                        ratingImdb: 9.3,
                        episodes: [
                            {
                                id: 1,
                                title: 'Winter Is Coming',
                                duration: '60 minutes',
                            },
                            {
                                id: 2,
                                title: 'The Kingsroad',
                                duration: '58 minutes',
                            },
                            // Other episodes...
                        ],
                    },
                },
                SeriePost: {
                    type: 'object',
                    required: ['title', 'photoSrc', 'releaseYear', 'ratingImdb'],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the series',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the series',
                        },
                        releaseYear: {
                            type: 'number',
                            description: 'The release year of the series',
                        },
                        ratingImdb: {
                            type: 'number',
                            description: 'The IMDb rating of the series',
                        },
                    },
                    example: {
                        title: 'Game of Thrones',
                        photoSrc: 'https://example.com/game-of-thrones.jpg',
                        releaseYear: 2011,
                        ratingImdb: 9.3,
                    },
                },
                SeriePatch: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the series',
                        },
                        photoSrc: {
                            type: 'string',
                            description: 'The photo source of the series',
                        },
                        releaseYear: {
                            type: 'number',
                            description: 'The release year of the series',
                        },
                        ratingImdb: {
                            type: 'number',
                            description: 'The IMDb rating of the series',
                        },
                    },
                    example: {
                        title: 'Game of Thrones',
                        photoSrc: 'https://example.com/game-of-thrones.jpg',
                        releaseYear: 2011,
                        ratingImdb: 9.3,
                    },
                },
                Episode: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'The auto-generated id of the episode',
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the episode',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the episode',
                        },
                    },
                    example: {
                        id: 1,
                        title: 'Winter Is Coming',
                        duration: '60 minutes',
                    },
                },
                EpisodePost: {
                    type: 'object',
                    required: ['title', 'duration'],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the episode',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the episode',
                        },
                    },
                    example: {
                        title: 'Winter Is Coming',
                        duration: '60 minutes',
                    },
                },
                EpisodePatch: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the episode',
                        },
                        duration: {
                            type: 'string',
                            description: 'The duration of the episode',
                        },
                    },
                    example: {
                        title: 'Winter Is Coming',
                        duration: '60 minutes',
                    },
                },
            },
        },
        tags: [
            {
                name: 'Movies',
                description: 'The movies managing API',
            },
            {
                name: 'Authentication',
                description: 'The authentication managing API',
            },
            {
                name: 'Users',
                description: 'The users managing API',
            },
            {
                name: 'Genres',
                description: 'The genres managing API',
            },
            {
                name: 'Episodes',
                description: 'The episodes managing API',
            },
            {
                name: 'Series',
                description: 'The series managing API',
            },
        ],
        paths: {
            '/movies': {
                get: {
                    summary: 'Returns the list of all the movies',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            name: 'sortBy',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                            description: 'Sort field for movies (e.g., title, releaseYear)',
                        },
                        {
                            name: 'ascOrDesc',
                            in: 'query',
                            schema: {
                                type: 'string',
                                enum: ['asc', 'desc'],
                            },
                            description: 'Sort order for movies (ascending or descending)',
                        },
                        {
                            name: 'page',
                            in: 'query',
                            schema: {
                                type: 'integer',
                            },
                            description: 'Page number for pagination',
                        },
                        {
                            name: 'pageSize',
                            in: 'query',
                            schema: {
                                type: 'integer',
                            },
                            description: 'Number of items per page for pagination',
                        },
                        {
                            name: 'title',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                            description: 'Search movies by title',
                        },
                        {
                            name: 'filterValue',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                            description: 'Value to filter movies',
                        },
                        {
                            name: 'filterName',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                            description: 'Name of the field to filter movies',
                        },
                        {
                            name: 'filterOperator',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                            description: 'Operator to use for filtering (e.g., eq, gt, lt)',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'The list of the movies',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Movie',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: 'Create a new movie',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MoviePost',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'The movie was successfully created',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/MoviePost',
                                    },
                                },
                            },
                        },
                        '500': {
                            description: 'Some server error',
                        },
                    },
                },
            },
            '/movies/{id}': {
                get: {
                    summary: 'Get the movie by id',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'number',
                            },
                            required: true,
                            description: 'The movie id',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'The movie description by id',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Movie',
                                    },
                                },
                            },
                        },
                        '404': {
                            description: 'The movie was not found',
                        },
                    },
                },
                delete: {
                    summary: 'Remove the movie by id',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'number',
                            },
                            required: true,
                            description: 'The movie id',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'The movie was deleted',
                        },
                        '404': {
                            description: 'The movie was not found',
                        },
                    },
                },
                patch: {
                    summary: 'Update the movie by the id',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'number',
                            },
                            required: true,
                            description: 'The movie id to update',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MoviePatch',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'The movie was updated',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/MoviePatch',
                                    },
                                },
                            },
                        },
                        '404': {
                            description: 'The movie was not found',
                        },
                        '500': {
                            description: 'Some error happened',
                        },
                    },
                },
                put: {
                    summary: 'Update the movie by the id',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'number',
                            },
                            required: true,
                            description: 'The movie id to update',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MoviePost',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'The movie was updated',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/MoviePost',
                                    },
                                },
                            },
                        },
                        '404': {
                            description: 'The movie was not found',
                        },
                        '500': {
                            description: 'Some error happened',
                        },
                    },
                },
            },
            '/movies/{title}': {
                get: {
                    summary: 'Get the movie by title',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'title',
                            schema: {
                                type: 'string',
                            },
                            required: true,
                            description: 'The movie title',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'The movie description by title',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Movie',
                                    },
                                },
                            },
                        },
                        '404': {
                            description: 'The movie was not found',
                        },
                    },
                },
            },
            '/latestMovies': {
                get: {
                    summary: 'Returns the list of the latest movies',
                    tags: ['Movies'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'The list of the latest movies',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Movie',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/register': {
                post: {
                    summary: 'Register a new user',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'Email address of the user',
                                        },
                                        password: {
                                            type: 'string',
                                            minLength: 6,
                                            pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{6,}$',
                                            description: 'Password of the user',
                                        },
                                        userName: {
                                            type: 'string',
                                            minLength: 3,
                                            pattern: '^[a-zA-Z0-9]*$',
                                            description: 'Username of the user',
                                        },
                                    },
                                    required: ['email', 'password', 'userName'],
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'User registered successfully',
                        },
                        400: {
                            description: 'Invalid request data',
                        },
                    },
                },
            },
            '/login': {
                post: {
                    summary: 'Login to the application',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'Email address of the user',
                                        },
                                        password: {
                                            type: 'string',
                                            minLength: 6,
                                            pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{6,}$',
                                            description: 'Password of the user',
                                        },
                                    },
                                    required: ['email', 'password'],
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'User logged in successfully',
                        },
                        400: {
                            description: 'Invalid request data',
                        },
                    },
                },
            },
            '/validateUser': {
                get: {
                    summary: 'Validate User',
                    tags: ['Authentication'],
                    security: [
                        {
                            bearerAuth: [],
                        },
                    ],
                    responses: {
                        200: {
                            description: 'User is authenticated',
                        },
                        401: {
                            description: 'Unauthorized - Token is missing or invalid',
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
