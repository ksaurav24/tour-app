const User = require("../models/userModel");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const getLogger = require("../utils/logger");
const jwt = require('jsonwebtoken');
const logger = getLogger('AuthMiddleware');


const isLoggedIn = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(403).send(new ApiResponse(403,null,"Please provide authorization token"))
        }
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            res.status(400).send(new ApiResponse(400,null,"Invalid Authorization token"))
        }
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        logger.error('Error fetching user profile', { error: error.message });        
        res.status(500).send(new ApiResponse(500, null,"Unable to fetch user profile"))
    }
})

const isVerified = asyncHandler(async(req,res,next)=>{
    // if(!req?.user?.isVerified){
    //     return res.status(403).send(new ApiResponse(403,null,"Verify your Email"))
    // }
    next();
})

module.exports = {
    isLoggedIn,
    isVerified
}