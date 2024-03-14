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
