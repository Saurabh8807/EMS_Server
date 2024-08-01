import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerEmployee = asyncHandler(async (req, res, next) => {
  console.log(req.body);

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
    [
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
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "Employee ID or email already exists.");
  }

  const user = await User.create({
    employeeId,
    name,
    email,
    phone,
    password,
    address,
    role,
    designation,
    teamLead,
    isTeamLead: "false",
    gender,
    marital_status,
    joining_date,
    date_of_birth,
    role: "employee",
  });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );
//   console.log(createdUser);

//   if (!createdUser) {
//     throw new ApiError(500, "Failed to create user.");
//   }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Employee Register Success"));
});

const loginEmployee=asyncHandler(async(req,res,next)=>{
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

    return res
    .status(200)
    .cookie("accessToken", accessToken)
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


// if( name && 
//     email &&
//     phone,
//     password,
//     address,
//     role,
//     designation,
//     teamLead,
//     isTeamLead,
//     gender,
//     marital_status,
//     joining_date,
//     date_of_birth,) 