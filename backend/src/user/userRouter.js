import express from 'express';
import { createUser } from './userController.js';
import { verifyJWT } from '../middleware/userMiddleware.js';

const userRouter = express.Router();

userRouter.post('/createUser', createUser);

router.get("/profile", verifyJWT, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});


export default userRouter;