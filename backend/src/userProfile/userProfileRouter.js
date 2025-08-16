import express from 'express';
import { connection, createProfile, updateSkills, updateStatus } from './userProfileController.js';
import multer from 'multer';
import path from 'node:path';   
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const userProfileRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fieldSize : 3e7 }
})

userProfileRouter.post('/:name', upload.fields([{name: 'ProfileImg', maxCount: 1}]), createProfile);

userProfileRouter.post('/updateSkills/:profileId', updateSkills);

userProfileRouter.post('/update/status/:profileId', updateStatus);

userProfileRouter.post('/connection/:profileId', connection);

export default userProfileRouter;