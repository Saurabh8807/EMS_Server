import {Router} from "express";
// import { admin } from "../middleware/auth.middleware";
import { registerEmployee,loginEmployee,refreshAccessToken,logout } from "../controllers/auth.controller.js";
import {verifyJWT,admin,hr } from "../middleware/auth.middleware.js"

const authRoutes = Router();

authRoutes.post('/register',verifyJWT,admin,registerEmployee )
authRoutes.post('/login' ,loginEmployee )
authRoutes.post('/refreshTokens',refreshAccessToken )
authRoutes.post('/logout',verifyJWT,logout )

export default authRoutes