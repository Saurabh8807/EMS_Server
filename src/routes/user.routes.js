import {Router} from "express";
// import { admin } from "../middleware/auth.middleware";
import { registerEmployee } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post('/register' ,registerEmployee )


export default userRoutes