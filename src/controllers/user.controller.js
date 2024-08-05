import User from "../models/user.model.js";
import {generateTokens} from "../utils/generateTokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

export const registerEmployee = asyncHandler(async (req, res, next) => {

  const {
    employeeId,
    name,
    email,
    phone,
    password,
    address,
    role,
    designation,
    teamLead,
    isTeamLead,
    gender,
    marital_status,
    joining_date,
    date_of_birth,
  } = req.body;
  
  if (
    employeeId == "" &&
    name == "" &&
    email == "" &&
    phone == "" &&
    password  == "" &&
    address  == ""&&
    role == ""&&
    designation  == ""&&
    teamLead  == ""&&
    isTeamLead == "" &&
    gender  == ""&&
    marital_status  == ""&&
    joining_date == ""&&
    date_of_birth ==""
  ) {
    throw new ApiError(400, "All fields are required......");
  }

  const existedUser = await User.findOne({email});

  if (existedUser) {
    throw new ApiError(400, "Employee ID or email already exists.");
  }

  await User.create({
    employeeId,
    name,
    email,
    phone,
    password,
    address,
    role: role,  // Default role to "employee" if not provided
    designation,
    teamLead,
    isTeamLead: isTeamLead,  // Default isTeamLead to false if not provided
    gender,
    marital_status,
    joining_date,
    date_of_birth,
  });


  return res
    .status(201)
    .json(new ApiResponse(200, "Employee Register Success"));
});

export const loginEmployee = asyncHandler(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email ||!password){
        throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(401, "Invalid email or password.");
    }
    const isPasswordValid = await user.matchPassword(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid email or password.");
    }

    const {accessToken, refreshToken} = await generateTokens(user._id)

    user.refreshToken =refreshToken;
    const options = {
      httpOnly: true,
      secure: true
  }
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
            200,
            user,
            "Login Successful",
            {
              accessToken,
              refreshToken,
            }
        )
    )

})


export const logout = asyncHandler(async(req, res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: true
}
  return res
   .status(200)
   .clearCookie("accessToken" , options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200,{},"User Logged Out"))
})

export const refreshAccessToken = asyncHandler(async(req, res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if( !incomingRefreshToken){
    throw new ApiError(401, "No refresh token provided.")
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodeToken.id).select('-password')
    
    if(!user){
      throw new ApiError(401, "Invalid refresh token.")
    }

    if(incomingRefreshToken !== user.refreshToken){
      throw new ApiError(401, "Invalid refresh token.")
    }

    const { accessToken,  newRefreshToken} = await generateTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(
      new ApiResponse(
        200,
        user,
        "Refresh Token Successful",
        {
          accessToken,
          refreshToken: newRefreshToken,
        }
      )
    )

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token")
  }
})

