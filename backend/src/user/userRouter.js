import express from 'express';
import { createUser, login } from './userController.js';

const userRouter = express.Router();

userRouter.post('/createUser', createUser);

userRouter.post('/login', login);


export default userRouter;