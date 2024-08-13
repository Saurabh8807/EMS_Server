import { Router } from 'express'

import { createDesignation, getAllDesignation,getDesignationById,updateDesignation,deleteDesignation } from '../controllers/designation.controller.js'

import {verifyJWT,admin,hr } from "../middleware/auth.middleware.js"

const designationRoutes = Router()

designationRoutes.post('/',createDesignation)
designationRoutes.get('/',getAllDesignation)
designationRoutes.get('/:id',getDesignationById)
designationRoutes.put('/:id',updateDesignation)
designationRoutes.delete('/:id',deleteDesignation)

export default designationRoutes

