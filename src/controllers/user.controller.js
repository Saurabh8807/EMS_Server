import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate("role", "name")
      .populate("designation", "name")
      .populate("teamLead", "name");
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  });

  export const getAllUsers = asyncHandler(async(req,res)=>{
    console.log(req.query)
    console.log(req.query.search)
    const keyword = req.query.search ?
    {
      $or:[
        {name:{$regex: req.query.search, $options: "i" }},
        {email:{$regex: req.query.search, $options: "i" }}
      ]
    }:{}
    
    const employees = await User.find(keyword)
                                .populate("role","name")
                                .populate("designation","name")
                                .populate("teamLead","name");
    return res
      .status(200)
      .json(new ApiResponse(200,employees,"All employees fetched successfully"))
  })
  
  export const getUserByRole = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const user = await User.find({role:id})
                        .populate('role', 'name') 
                        .populate('designation', 'name') 
                        .populate('teamLead', 'name'); 


    if(user.length===0){
        throw new ApiError(404, 'No users found with the specified role');

    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'Users retrieved successfully'));

  })

  export const getUserByDesignation = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const user = await User.find({designation:id})
                        .populate('role', 'name') 
                        .populate('designation', 'name') 
                        .populate('teamLead', 'name'); 


    if(user.length===0){
        throw new ApiError(404, 'No users found with the specified role');

    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, 'Users retrieved successfully'));

  })

  export const updateUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    const user = await User.findByIdAndUpdate(
      id, 
      { $set: updatedData }, 
      {
        new: true, 
        runValidators: true, 
      }
    )
      .populate("role", "name")
      .populate("designation", "name")
      .populate("teamLead", "name");
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  });
  
  export const deactivateUserById = asyncHandler(async (req,res)=>{
    const {id}= req.params

    const user = await User.findByIdAndUpdate(
        id,
        {isActive:false},
        {new:true}
    )

    if (!user) {
        throw new ApiError(404, "User not found");
      }
    
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User activated successfully"));
    
  })

  export const activateUserById = asyncHandler(async (req,res)=>{
    const {id}= req.params

    const user =await User.findByIdAndUpdate(
        id,
        {isActive:true},
        {new:true}
    )

    if (!user) {
        throw new ApiError(404, "User not found");
      }
    
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User deactivated successfully"));
    
  })