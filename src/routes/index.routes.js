import { Router } from "express";
import  userRoutes  from './user.routes.js'
import  designationRoutes  from './designation.routes.js'
import  roleRoutes  from './role.routes.js'

const router = Router();

router.use('/user', userRoutes)
router.use('/designation', designationRoutes)
router.use('/role', roleRoutes)

export default router