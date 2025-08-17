import express from 'express';
import { verifyJWT } from '../middleware/userMiddleware.js';
import {
    createUser,
    login,
    getUserById,
    updateUserById,
    getProfile,
} from "./userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);

userRouter.get("/profile", verifyJWT, getProfile);

userRouter.post("/login", login);

userRouter.get("/:id", getUserById);

userRouter.put("/:id", updateUserById);

export default userRouter;
