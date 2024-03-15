import express from 'express';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { userSchemaUpdate, userSchemaPost } from '../schemas/user.schema';

const router = express.Router();

export default router;