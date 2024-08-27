import { Router } from "express";
import {
  getUserById,
  getAllUsers,
  getUserByRole,
  getUserByDesignation,
  updateUserById,
  deactivateUserById,
  activateUserById,
} from "../controllers/user.controller.js";
import { verifyJWT, admin, hr , adminOrHr } from "../middleware/auth.middleware.js";

const userRoutes = Router();

userRoutes.get("/:id", verifyJWT, getUserById);

userRoutes.get("/", getAllUsers);

userRoutes.get("/role/:id", verifyJWT, adminOrHr, getUserByRole);

userRoutes.get("/designation/:id", verifyJWT, adminOrHr, getUserByDesignation);

userRoutes.put("/:id", verifyJWT, admin, updateUserById);

userRoutes.put("/:id/deactivate", verifyJWT, admin, deactivateUserById);

userRoutes.put("/:id/activate", verifyJWT, admin, activateUserById);

export default userRoutes;
