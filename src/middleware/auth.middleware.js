import iwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const protect = asyncHandler(async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.splits(' ')[1];
            const decode = jwt.verify(token)
            req.user = await User.findById(decode.id).select('-password')
            next()
        } catch (error) {
            throw new ApiError(401, 'Not authorized, token failed')          
        }

        if(!token){
            throw new ApiError(401, 'Not authorized, no token')
        }
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

export {protect, admin, employee, hr}