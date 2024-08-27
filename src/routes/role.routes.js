import { Router } from 'express'

import {createRole, getAllRoles,getRoleById,updateRole,deleteRole } from '../controllers/role.controller.js'

import {verifyJWT,admin,hr, adminOrHr } from "../middleware/auth.middleware.js"

const roleRoutes = Router()

roleRoutes.post('/',verifyJWT,adminOrHr,createRole)
roleRoutes.get('/',verifyJWT,adminOrHr,getAllRoles)
roleRoutes.get('/:id',verifyJWT,adminOrHr,getRoleById)
roleRoutes.put('/:id',verifyJWT,adminOrHr,updateRole)
roleRoutes.delete('/:id',verifyJWT,adminOrHr,deleteRole)

export default roleRoutes

