const jwt=require("jsonwebtoken");
require("dotenv").config();


function usermiddleware(req,res,next){
    const token=req.headers.authorization;
    if( !token){
        return res.status(401).json({
            msg:"token missing"
        })
    }
    const words=token.split(" ");
    const jwttoken=words[1];
try{
    const decoded=jwt.verify(jwttoken,process.env.JWT_SECRET);
     req.user={
        userId:decoded.userId,
        username:decoded.username
     }

      
        next();

    }catch(err){
        res.status(401).json({
            msg:"invalid token"
        })
    }
}
module.exports={usermiddleware}