import express from 'express';
import { applyForJob, getAllJobs } from './jobController.js';
import { postJob } from './jobController.js';
import multer from 'multer';
import path from 'node:path';   
import { fileURLToPath } from 'node:url';
import Auth from '../middleware/Auth.js';
import { getJobById } from './jobController.js';
import { deleteJob } from './jobController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobRouter = express.Router();

jobRouter.get('/', getAllJobs);

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fieldSize : 3e7 }
})

//Using multer as a middleware

jobRouter.post('/', upload.fields([{name: 'JobImg', maxCount: 1}]), Auth ,  postJob);

jobRouter.get('/get/:jobId', getJobById);

jobRouter.get('/apply/:jobId', Auth, applyForJob);

jobRouter.delete('/delete/:jobId' , deleteJob);

export default jobRouter;