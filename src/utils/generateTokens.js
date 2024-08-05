import User from '../models/user.model.js';
import { ApiError } from './apiError.js';
import { asyncHandler } from './asyncHandler.js';

export const generateTokens = async(id) => {
    try {
        const user = await User.findById(id);  // Use findById instead of findOne
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken =await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

     

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
};
