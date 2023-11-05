import { isAuth } from '../auth/verifyToken.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateUser = async(req, res) => {
    const id = req.params.id;
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password, salt);
    }
    try{
    const updatedUser = await User.findByIdAndUpdate(id,{
        $set: req.body,
    }, {new:true} 
    );
    return res.status(200).json({success:true, message:'Update successful', data: updatedUser})
    }catch(err){
        return res.status(500).json({success:false, message:'Unable to update'})
    }
}

export const deleteUser = async(req, res) => {
    const id = req.params.id;
    try{
        await User.findByIdAndDelete(id);
    return res.status(200).json({success:true, message:'Delete successful'})
    }catch(err){
        return res.status(500).json({success:false, message:'Unable to delete'})
    }
}

export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        const {password, ...rest} = user._doc;
    return res.status(200).json({success:true, message:'User found successfuly', data: rest})
    }catch(err){
        return res.status(500).json({success:false, message:'Unable to find user'})
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        if(users.length === 0){
            return res.status(404).json({success:false, message:'No users available'})
        }
    return res.status(200).json({success:true, message:'Users found successfuly', data: users})
    }catch(err){
        return res.status(500).json({success:false, message:'Unable to find users'})
    }
}

export const getUserBySearch = async (req, res) => {
    try {
      // Check if a username query parameter is provided
      const usernameQuery = req.query.username;
  
      if (!usernameQuery) {
        return res.status(400).json({ success: false, message: 'Please provide a username query parameter' });
      }
  
      // Create a case-insensitive regular expression for the username
      const usernameRegex = new RegExp(usernameQuery, 'i');
  
      // Use the regular expression in the query criteria
      const queryCriteria = { username: usernameRegex };
  
      // Find users that match the query criteria, excluding the 'password' field
      const users = await User.find(queryCriteria).select('-password');
  
      if (users.length > 0) {
        return res.status(200).json({ success: true, message: 'Users found successfully', data: users });
      } else {
        return res.status(404).json({ success: false, message: 'No users found with the provided username' });
      }
    } catch (err) {
      console.error('Error in getUserBySearch:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while searching for users' });
    }
  }
  



