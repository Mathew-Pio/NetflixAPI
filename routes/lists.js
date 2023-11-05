import express from 'express';
const router = express.Router();
import { createList, getList, deleteList } from '../controllers/lists.js';
import { isAdmin, isAuth } from '../auth/verifyToken.js';

router.post('/', isAdmin, createList);

router.get('/',isAuth, getList);

router.delete('/:id', isAdmin, deleteList);

export default router;