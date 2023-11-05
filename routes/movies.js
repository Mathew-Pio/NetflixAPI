import express from 'express';
import { createMovie, updateMovie, getMovie, getAllMovies, getRandom, deleteMovie, getMovieByName } from '../controllers/movies.js'; 
import { isAuth, isAdmin } from '../auth/verifyToken.js';
const router = express.Router();

router.post('/', isAdmin, createMovie );

router.put('/:id', isAdmin, updateMovie);

router.get('/:id', isAuth, getMovie);

router.delete('/:id', isAdmin, deleteMovie);

router.get('/', getAllMovies);

router.get('/search/getRandom', isAuth, getRandom);

router.get('/search/getMovieByName', isAuth, getMovieByName);

export default router;