import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign(
        {id:user._id, isAdmin: user.isAdmin},
        process.env.JWT_SECRET_KEY,
        { expiresIn: '4d' }
    )
}

export const signup = async (req, res) => {
    let existingUser;
    try{
    const { username, email, password } = req.body;
    existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({success:false, message:'User with this email already exists'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    const savedUser = await newUser.save();
    return res.status(201).json({success: true, message:'User created successfully', data: savedUser})
    }catch(err){
        return res.status(500).json({success: false, message:'Failed to create user'})
    }
}

export const login = async (req, res) => {
    let user;
    try{
        const { email } = req.body;

        user = await User.findOne({email});
        if(!user){
            return res.status(404).json({sucess:false, message: 'no user found'});
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch){
            return res.status(404).json({sucess:false, message: 'password does not match'});
        }
        const token = generateToken(user);
        const { password, ...rest } = user._doc
        return res.status(200).json({success: true, message:'User login successful',token: token, data: user._doc})
    }catch(err){
        return res.status(500).json({err, success: false, message:'Failed to login user'})
    }
}