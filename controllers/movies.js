import Movie from '../models/Movie.js';

export const createMovie = async (req, res) => {
    const newMovie = new Movie(req.body);
    try{
        const savedMovie = await newMovie.save();
        return res.status(201).json({ success:true, message:'movie created', data: savedMovie })
    }catch(err){
        return res.status(500).json({success: false, message:'failed to created movie'})
    }
}

export const updateMovie = async (req, res) => {
    const id = req.params.id;
    try{
    const updatedMovie = await Movie.findByIdAndUpdate(id,
        { $set: req.body },
        { new: true }
    );
    return res.status(201).json({ success:true, message:'movie updated', data: updatedMovie })
    }catch(err){
        return res.status(500).json({success: false, message:'failed to update movie'})
    }
}

export const deleteMovie = async (req, res) => {
    const id = req.params.id;
    try{
    await Movie.findByIdAndDelete(id);
    return res.status(201).json({ success:true, message:'movie deleted' })
    }catch(err){
        return res.status(500).json({success: false, message:'failed to delete movie'})
    }
}

export const getMovie = async (req, res) => {
    const id = req.params.id;
    try{
    const movie = await Movie.findById(id);
    return res.status(201).json({ success:true, message:'movie deleted', data: movie })
    }catch(err){
        return res.status(500).json({success: false, message:'Movie not availabe on netflix'})
    }
}

// getAllMovies

export const getAllMovies = async (req, res) => {
    try{
        const movies = await Movie.find();
        return res.status(200).json({ success:true, message:'Movies found', data: movies })
    }catch(err){
        return res.status(500).json({success: false, message:'Internal server error'})
    }
}

// GET random videos
export const getRandom = async (req, res) => {
    const type = req.query.type;
    let movie;
    try{
        if(type === 'series'){
            movie = await Movie.aggregate([
                {$match: {isSeries: true} },
                {$sample: { size: 1 }}
            ])
        }else{
            movie = await Movie.aggregate([
                {$match: {isSeries: false} },
                {$sample: { size: 1 }}
            ])
        }
        return res.status(200).json({ success:true, message:'Movie found', data: movie})
    }catch(err){
        return res.status(500).json({success: true, message:'failed to get random'})
    }
} 

export const getMovieByName = async (req, res) => {
    const title = req.query.name;
    const genre = req.query.genre;

    const nameRegex = new RegExp(title, 'i');
    const genreRegex = new RegExp(genre, 'i');
    try{
    let queryCriteria;
    if(title){
    queryCriteria = { title:nameRegex }
    }
    if(genre){
    queryCriteria = { genre: genreRegex }
    }
    const movie = await Movie.find(queryCriteria);
    if(movie.length === 0){
        return res.status(404).json({success:false, message: 'no movie found'})
    }
    return res.status(200).json({success:true, message:'Movie found', data: movie})
    }catch(err){
        return res.status(500).json({success:false, message:'No results for this search'})
    }
}







