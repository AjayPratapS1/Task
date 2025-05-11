import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  updateUserPassword,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();
//  PUBLIC LINK
//register route
userRouter.post("/register", registerUser);
// Login route
userRouter.post("/login", loginUser);

//  PRIVATE LINK AND PROTECTED LINK
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/password", authMiddleware, updateUserPassword);

export default userRouter;
