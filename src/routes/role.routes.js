import { Router } from 'express'

import {createRole, getAllRoles,getRoleById,updateRole,deleteRole } from '../controllers/role.controller.js'

import {verifyJWT,admin,hr } from "../middleware/auth.middleware.js"

const designationRoutes = Router()

designationRoutes.post('/',createRole)
designationRoutes.get('/',getAllRoles)
designationRoutes.get('/:id',getRoleById)
designationRoutes.put('/:id',updateRole)
designationRoutes.delete('/:id',deleteRole)

export default designationRoutes

