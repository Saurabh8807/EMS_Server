import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Designation from "../models/designation.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

export const registerEmployee = asyncHandler(async (req, res) => {
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
      password == "" &&
      address == "" &&
      role == "" &&
      designation == "" &&
      isTeamLead == "" &&
      gender == "" &&
      marital_status == "" &&
      joining_date == "" &&
      date_of_birth == ""
    ) {
      throw new ApiError(400, "All fields are required......");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      throw new ApiError(400, "Employee ID or email already exists.");
    }

    if(designation){
      console.log("designation=>",designation)
      const foundDesignation = await Designation.findById(designation)
      console.log(foundDesignation)
      if(!foundDesignation){
        throw new ApiError(404,"Designation Not Found")
      }

      foundDesignation.employeeCount +=1 ; 

      await foundDesignation.save();
    }

    if(role){
      const foundRole = await Role.findById(role)

      if(!foundRole){
        throw new ApiError(404,"Role Not Found")
      }

      foundRole.employeeCount +=1 ; 

      await foundRole.save();
    }

    const createdUser = await User.create({
      employeeId,
      name,
      email,
      phone,
      password,
      address,
      role: role, 
      designation,
      teamLead,
      isTeamLead: isTeamLead, 
      gender,
      marital_status,
      joining_date,
      date_of_birth,
    });
    console.log("ok");
    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Employee Register Success"));
   
});

export const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
    // console.log('invalid');

    // res.send('not valid').status(400)
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.refreshToken = refreshToken;
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, user, "Login Successful", {
        accessToken,
        refreshToken,
      })
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log(req.cookie);
  console.log("called");

  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "No refresh token provided.");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken.id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const { accessToken, newRefreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(200, user, "Refresh Token Successful", {
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});
