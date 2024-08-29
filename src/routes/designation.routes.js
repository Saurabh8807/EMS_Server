import { Router } from 'express'

import { createDesignation, getAllDesignation,getDesignationById,updateDesignation,deleteDesignation } from '../controllers/designation.controller.js'

import {verifyJWT,admin,hr } from "../middleware/auth.middleware.js"

const designationRoutes = Router()

designationRoutes.post('/',verifyJWT,createDesignation)
designationRoutes.get('/',verifyJWT,getAllDesignation)
designationRoutes.get('/:id',verifyJWT,getDesignationById)
designationRoutes.put('/:id',verifyJWT,updateDesignation)
designationRoutes.delete('/:id',verifyJWT,deleteDesignation)

export default designationRoutes

