import express from 'express';
import { validateUser } from '../middlewares/validateUser';
import { userSchemaUpdate, userSchemaPost } from '../schemas/userSchema';

const router = express.Router();

export default router;