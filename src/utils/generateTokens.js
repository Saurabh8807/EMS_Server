import User from '../models/user.model.js';
import { ApiError } from './apiError.js';
import { asyncHandler } from './asyncHandler.js';

export const generateTokens = async(user) => {
    try {
        // const user = await User.findById(id)
        //                     .populate("role","name")
        //                     .populate("designation","name")
        //                     .populate("teamLead","name")       
                            
        // console.log("user in generate token",user)
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken =await user.generateRefreshToken();

        // console.log("incomingRefreshToken=>",refreshToken)
        // console.log("user.refreshToken=>",user.refreshToken)
        // console.log(refreshToken==user.refreshToken)
        

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        // console.log(refreshToken==user.refreshToken)
     
        // console.log("refreshtoken in function=>",refreshToken)
        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
};
