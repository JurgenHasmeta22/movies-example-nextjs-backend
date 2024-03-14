import express from 'express';
import movieController from '../controllers/movieController';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { movieSchemaUpdate, movieSchemaPost } from '../schemas/movieSchema';
import { favoriteSchema } from '../schemas/favoriteSchema';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The movie title
 *         videoSrc:
 *           type: string
 *           description: The video source of the movie
 *         photoSrc:
 *           type: string
 *           description: The photo source of the movie
 *         trailerSrc:
 *           type: string
 *           description: The trailer source of the movie
 *         duration:
 *           type: string
 *           description: The duration of the movie
 *         ratingImdb:
 *           type: string
 *           description: The rating of the movie
 *         releaseYear:
 *           type: string
 *           description: The release year of the movie
 *         description:
 *           type: string
 *           description: The description of the movie
 *         views:
 *           type: string
 *           description: The views of the movie
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *           description: The genres of the movie
 *       example:
 *         id: abc123
 *         title: Inception
 *         director: Christopher Nolan
 *         genre: Science Fiction
 *         releaseYear: 2010
 *         rating: 8.8
 *         duration: 148 minutes
 *         description: A thief who enters the dreams of others to steal their secrets.
 *         views: 1000000
 *         genres:
 *           - id: 1
 *             name: Science Fiction
 *           - id: 2
 *             name: Action
 *     MoviePost:
 *       type: object
 *       required:
 *         - title
 *         - videoSrc
 *         - photoSrc
 *         - trailerSrc
 *         - duration
 *         - ratingImdb
 *         - releaseYear
 *         - description
 *         - views
 *       properties:
 *         title:
 *           type: string
 *           description: The movie title
 *         videoSrc:
 *           type: string
 *           description: The video source of the movie
 *         photoSrc:
 *           type: string
 *           description: The photo source of the movie
 *         trailerSrc:
 *           type: string
 *           description: The trailer source of the movie
 *         duration:
 *           type: string
 *           description: The duration of the movie
 *         ratingImdb:
 *           type: string
 *           description: The rating of the movie
 *         releaseYear:
 *           type: string
 *           description: The release year of the movie
 *         description:
 *           type: string
 *           description: The description of the movie
 *         views:
 *           type: string
 *           description: The views of the movie
 *       example:
 *         title: Inception
 *         director: Christopher Nolan
 *         genre: Science Fiction
 *         releaseYear: 2010
 *         rating: 8.8
 *         duration: 148 minutes
 *         description: A thief who enters the dreams of others to steal their secrets.
 *         views: 1000000
 *     MoviePatch:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The movie title
 *         videoSrc:
 *           type: string
 *           description: The video source of the movie
 *         photoSrc:
 *           type: string
 *           description: The photo source of the movie
 *         trailerSrc:
 *           type: string
 *           description: The trailer source of the movie
 *         duration:
 *           type: string
 *           description: The duration of the movie
 *         ratingImdb:
 *           type: string
 *           description: The rating of the movie
 *         releaseYear:
 *           type: string
 *           description: The release year of the movie
 *         description:
 *           type: string
 *           description: The description of the movie
 *         views:
 *           type: string
 *           description: The views of the movie
 *       example:
 *         title: Inception
 *         director: Christopher Nolan
 *         genre: Science
 *         releaseYear: 2010
 *         rating: 8.8
 *         duration: 148 minutes
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the favorite
 *         userId:
 *           type: number
 *           description: The id of the user who favorited the movie
 *         movieId:
 *           type: number
 *           description: The id of the favorite movie
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: The user who favorited the movie
 *         movie:
 *           $ref: '#/components/schemas/Movie'
 *           description: The favorite movie
 *       example:
 *         id: 1
 *         userId: 123
 *         movieId: 456
 *         user:
 *           id: 123
 *           username: user1
 *           email: user1@example.com
 *         movie:
 *           id: abc123
 *           title: Inception
 *           director: Christopher Nolan
 *           genre: Science Fiction
 *           releaseYear: 2010
 *           rating: 8.8
 *           duration: 148 minutes
 *           description: A thief who enters the dreams of others to steal their secrets.
 *           views: 1000000
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The movies managing API
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/movies', movieController.getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get the movie by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: The movie was not found
 */
router.get('/movies/:id', movieController.getMovieById);

/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Get the movie by title
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie title
 *     responses:
 *       200:
 *         description: The movie description by title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: The movie was not found
 */
router.get('/movies/:title', movieController.getMovieByTitle);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Remove the movie by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie id
 *
 *     responses:
 *       200:
 *         description: The movie was deleted
 *       404:
 *         description: The movie was not found
 */
router.delete('/movies/:id', movieController.deleteMovieById);

/**
 * @swagger
 * /movies/{id}:
 *   patch:
 *     summary: Update the movie by the id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie id to update
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/MoviePatch'
 *   responses:
 *     200:
 *       description: The movie was updated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoviePatch'
 *     404:
 *       description: The movie was not found
 *     500:
 *       description: Some error happened
 */
router.patch('/movies/:id', movieSchemaUpdate, validateMiddleware, movieController.updateMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoviePost'
 *     responses:
 *       200:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MoviePost'
 *       500:
 *         description: Some server error
 */
router.post('/movies', movieSchemaPost, validateMiddleware, movieController.addMovie);

router.get('/searchMovies', movieController.searchMoviesByTitle);

/**
 * @swagger
 * /latestMovies:
 *   get:
 *     summary: Returns the list of the latest movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The list of the latest movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/latestMovies', movieController.getLatestMovies);

router.post('/favoritesMovies', favoriteSchema, validateMiddleware, movieController.addFavoriteMovieByUser);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update the movie by the id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The movie id to update
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/MoviePost'
 *   responses:
 *     200:
 *       description: The movie was updated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoviePost'
 *     404:
 *       description: The movie was not found
 *     500:
 *       description: Some error happened
 */
router.put('/movies/:id', movieSchemaPost, validateMiddleware, movieController.updateMovieById);

export default router;
