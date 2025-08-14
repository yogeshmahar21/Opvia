import express from 'express';
import globalErrorHandler from './middleware.js/GlobalErrorHandler.js';

const app = express();

//Global Error Handler

app.use(globalErrorHandler);


export default app;