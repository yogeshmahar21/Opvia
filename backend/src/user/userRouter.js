import express from 'express';
import {createUser, login, getUserByToken, getUserById, updateUserById} from "./userController.js";
import Auth from '../middleware/Auth.js';

const userRouter = express.Router();

userRouter.post("/register", createUser);

userRouter.post("/login", login);

userRouter.get("/", Auth, getUserByToken);

userRouter.get('/:id', getUserById);

userRouter.put("/:id", updateUserById);

export default userRouter;