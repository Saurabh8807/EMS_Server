import { Router } from "express";
import  authRoutes  from './auth.routes.js'
import  designationRoutes  from './designation.routes.js'
import  roleRoutes  from './role.routes.js'
import userRoutes from "./user.routes.js";
import birthDayRoutes from "./birthDay.routes.js";

const router = Router();

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/designation', designationRoutes)
router.use("/role", roleRoutes);
router.use("/birthDay", birthDayRoutes);

export default router