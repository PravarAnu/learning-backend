import asyncHandler from "../services/asyncHandler";
import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import config from "../config/index.config";

import customError from "../utils/customError.js"


export const isLoggedIn = asyncHandler(async (req,res,next)=>{
    let token;


    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
    }


    if(!token){
        throw new customError("Not authorized to access this resource", 401);
    }

    try {
        const decodedJwtToken = JWT.verify(token, config.JWT_SECRET);

        req.user = await User.findById(decodedJwtToken._id, "name email role");

        next();
    } catch (error) {
        throw new customError("Not authorized to access this resource", 401)
    }
})

export const authorize = (...requiresRoles) => asyncHandler( async (req, res, next)=>{
    if(!requiresRoles.includes(req.user,role)){
        throw new customError("You are not authorized to access this resource", 401);
    }

    next();
})