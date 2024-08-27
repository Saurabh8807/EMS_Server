import Designation from "../models/designation.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


export const createDesignation = asyncHandler(async(req,res)=>{
    const { name, description } = req.body

    if(!name || !description){
        throw new ApiError(400,"All fields are required")
    }

    const existedDesignation = await Designation.findOne({name})

    if(existedDesignation){
        throw new ApiError(400," This designation is already exists")
    }

    const createdDesignation = await Designation.create({
        name,
        description,
        employeeCount:0
    })
    // console.log(createDesignation)

    return res
        .status(201)
        .json(new ApiResponse(201,createdDesignation,"New Designation created"))
})

export const getAllDesignation= asyncHandler(async (req,res)=>{
    const desgnations = await Designation.find()

    return res
    .status(200)
    .json(new ApiResponse(200,desgnations,"All Designations fetched successfully"))

})

export const getDesignationById= asyncHandler(async(req,res)=>{
    const { id } = req.params

    const designation =  Designation.findById(id)

    if(!designation){
        throw new ApiError(404,"Designation not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, designation,"Designation fetched successfully",))

})

export const updateDesignation =asyncHandler(async(req,res)=>{
    const { id } = req.params

    const { name , description } = req.body

    let designation = await Designation.findById(id)

    if(!designation){
        throw new ApiError(404,"Designation not found")
    }

    designation.name = name || designation.name ;
    designation.description= description || designation.description;

    const updatedDesignation = await designation.save()

    return res
    .status(200)
    .json(new ApiResponse(200,updatedDesignation,"Designation updated successfully"))
})

export const deleteDesignation =asyncHandler(async(req,res)=>{
    const { id } = req.params

    const designation =  await Designation.findByIdAndDelete(id);

    if(!designation){
        throw new ApiError(404,"Designation not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200,designation,"Designation deleted Successfully"))
})