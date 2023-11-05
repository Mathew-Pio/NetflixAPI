import jwt from 'jsonwebtoken';

export const isAuth = async(req, res, next) => {
    const authToken = req.headers.authorization;
    if(!authToken || !authToken.startsWith('Bearer ')){
        return res.status(401).json({success: false, message: 'You are not authorized'})
    }
    try{

        const token = authToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decodedToken._id;
        req.isAdmin = decodedToken.isAdmin;
        next();
    }
    catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: 'Token expired'})
        }
        return res.status(401).json({err: console.log(err), success: false, message:'Invalid Token'})  
    }
}

export const isAdmin = async(req, res, next) => {
    isAuth(req, res, next, () => {
        if(req.isAdmin){
            next();
        }
        return res.status(401).json({success:false, message:"You're not authenticated"})
    })
}