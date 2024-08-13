import {Router} from "express";
// import { admin } from "../middleware/auth.middleware";
import { registerEmployee,loginEmployee,refreshAccessToken,logout } from "../controllers/user.controller.js";
import {verifyJWT,admin,hr } from "../middleware/auth.middleware.js"

const userRoutes = Router();

userRoutes.post('/register',registerEmployee )
userRoutes.post('/login' ,loginEmployee )
userRoutes.post('/refreshTokens',refreshAccessToken )
userRoutes.post('/logout',verifyJWT,logout )


export default userRoutes