import express from 'express';
import { validateMiddleware } from '../middlewares/validateMiddleware';
import { userSchemaUpdate, userSchemaPost } from '../schemas/userSchema';

const router = express.Router();

export default router;