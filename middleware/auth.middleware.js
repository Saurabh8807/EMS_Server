import iwt from 'jsonwebtoken'
import User from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/ayncHandler.js'

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

const admin = (req, res, next) =>{
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        throw new ApiError(401, 'Not authorized as an admin')
    }
}

const employee = (req, res, next)=>{
    if(req.user && req.user.role === 'employee'){
        next()
    }else{
        throw new ApiError(401, 'Not authorized as an employee')
    }
}

export {protect, admin, employee}