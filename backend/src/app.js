import express from 'express';
import globalErrorHandler from './middleware/GlobalErrorHandler.js';
import userRouter from './user/userRouter.js';

const app = express();

app.use(express.json());

app.use('/api', userRouter);

//Global Error Handler

app.use(globalErrorHandler);


export default app;