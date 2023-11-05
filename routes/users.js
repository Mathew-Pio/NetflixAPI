import express from 'express';
import { isAdmin } from '../auth/verifyToken.js';
import { updateUser, deleteUser, getSingleUser, getAllUsers, getUserBySearch } from '../controllers/users.js';
const router = express.Router();

router.put('/:id', isAdmin, updateUser);

router.delete('/:id', isAdmin, deleteUser);

router.get('/:id', isAdmin, getSingleUser);

router.get('/', isAdmin, getAllUsers);

router.get('/search/getUserBySearch', isAdmin, getUserBySearch);

export default router;