import express from 'express';
import {createUser, login, getUserById, updateUserById} from "./userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);

userRouter.post("/login", login);

userRouter.get("/:id", getUserById);

userRouter.put("/:id", updateUserById);

export default userRouter;