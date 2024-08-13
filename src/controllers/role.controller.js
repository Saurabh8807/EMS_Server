// src/controllers/roleController.js
import Role from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createRole = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const existingRole = await Role.findOne({ name });

    if (existingRole) {
        throw new ApiError(400, "This role already exists");
    }

    const createdRole = await Role.create({
        name,
        description,
        employeeCount: 0
    });

    return res
        .status(201)
        .json(new ApiResponse(201, createdRole, "New Role created"));
});

export const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find();

    return res
        .status(200)
        .json(new ApiResponse(200, roles, "All Roles fetched successfully"));
});

export const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
        throw new ApiError(404, "Role not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200 ,role, "Role fetched successfully"));
});

export const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    let role = await Role.findById(id);

    if (!role) {
        throw new ApiError(404, "Role not found");
    }

    role.name = name || role.name;
    role.description = description || role.description;

    const updatedRole = await role.save();

    return res
        .status(200)
        .json(new ApiResponse(200,updatedRole, "Role updated successfully"));
});

// Delete a Role
export const deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
        throw new ApiError(404, "Role not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,role, "Role deleted successfully"));
});
