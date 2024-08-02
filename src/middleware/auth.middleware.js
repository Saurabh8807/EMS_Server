import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const verifyJWT = asyncHandler(async (req, res, next)=>{

        try {
            const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }
    
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = await User.findById(decode._id).select('-password -refreshToken')
            next()
        } catch (error) {
            throw new ApiError(401, 'Not authorized, token failed')          
        }

        if(!token){
            throw new ApiError(401, 'Not authorized, no token')
        }
})

const admin = asyncHandler(async(req, res, next) =>{
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        throw new ApiError(401, 'Not authorized as an admin')
    }
})

const employee = asyncHandler(async(req, res, next)=>{
    if(req.user && req.user.role === 'employee'){
        next()
    }else{
        throw new ApiError(401, 'Not authorized as an employee')
    }
})

const hr = asyncHandler(async(req, res, next)=>{
    if(req.user && req.user.designation === 'hr'){
        next()
    }else{
        throw new ApiError(401, 'Not authorized as an hr')
    }
})

export {verifyJWT, admin, employee, hr}