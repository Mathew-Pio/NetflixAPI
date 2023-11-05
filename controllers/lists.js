import List from '../models/List.js';

export const createList = async (req, res) => {
    const newList = new List(req.body);
    try{
        const savedList = await newList.save();
        return res.status(201).json({ success:true, message:'list created', data: savedList })
    }catch(err){
        return res.status(500).json({err,success: false, message:'failed to created list'})
    }
}

export const getList = async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try{
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    { $sample: {size:10} },
                    { $match: {type: typeQuery, genre: genreQuery} }
                ])
            }else{
                list = await List.aggregate([
                    { $sample: {size:10} },
                    { $match: {type: typeQuery} }
                ])
            }
        }else{
            list = await List.aggregate([{ $sample: { size: 10 } }])
        }
        return res.status(200).json({success:true, message:'List found', data: list})
    }catch(err){
        return res.status(500).json({success: false, message:'failed to created list'})
    }
}

export const deleteList = async(req, res) => {
    const id = req.params.id;
    try{
        await List.findByIdAndDelete(id);
        return res.status(200).json({success:true, message:'List deleted'})
    }catch(err){
        return res.status(500).json({success: false, message:'failed to delete list'})
    }
}