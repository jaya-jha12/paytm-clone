import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export function  authmiddleware(req,res,next){
    console.log("authMiddleware reached");
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({});
    }
    const token=authHeader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }else{
            res.status(403).json({error:"Invalid or expired token"});
        }

        
    }catch(err){
        return res.status(403).json({error:"Invalid or expired token or forbidden request"});
    }
}
