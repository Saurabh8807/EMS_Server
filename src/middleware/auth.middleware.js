import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decode)
    const user = await User.findById(decode.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, 'Not authorized, token failed')
    }


    console.log("verifyJWT passed...");
    next();
});

const admin = asyncHandler(async (req, res, next) => {
  
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decode)

    if (decode.role !== "admin") {
      throw new ApiError(403, 'Unauthorized, not an admin')
    }
    console.log("admin passed...");
    next();

});

// const employee = asyncHandler(async(req, res, next)=>{
//     try {
//         const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }

//         const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         if(decode.role !== 'employee'){
//             throw new ApiError(403, 'Unauthorized, not an admin')  // Forbidden status code (403) is used for authorization failures. 401 is for unauthorized requests. 403 is for forbidden requests. 404 is for not found requests. 405 is for method not allowed requests. 500 is for server errors. 200 is for success.
//         }

//         next()
//        } catch (error) {
//          throw new ApiError(401, 'Not authorized, token failed')
//        }
// })

const hr = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decode.role !== "hr") {
      throw new ApiError(403, "Unauthorized, not an HR");
    }

    next();
  
});

export { verifyJWT, admin, hr };
