<<<<<<< HEAD
import express from 'express';
import { createUser } from './userController.js';
import { verifyJWT } from '../middleware/userMiddleware.js';
=======
import express from "express";
import {
    createUser,
    login,
    getUserById,
    updateUserById,
} from "./userController.js";
>>>>>>> 72a98e0fd9d0a407381ccd77211ff18a4c6e984f

const userRouter = express.Router();

userRouter.post("/createUser", createUser);

<<<<<<< HEAD
router.get("/profile", verifyJWT, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

=======
userRouter.post("/login", login);
>>>>>>> 72a98e0fd9d0a407381ccd77211ff18a4c6e984f

userRouter.get("/:id", getUserById);

userRouter.put("/:id", updateUserById);

export default userRouter;
