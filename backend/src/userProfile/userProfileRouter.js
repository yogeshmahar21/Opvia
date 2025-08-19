import express from 'express';
import { connection, createProfile, getProfile, sendConnectionRequest, updateSkills, updateStatus } from './userProfileController.js';
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

userProfileRouter.get('/:profileId', getProfile);

userProfileRouter.put('/updateSkills/:profileId', updateSkills);

userProfileRouter.put('/update/status/:profileId', updateStatus);

userProfileRouter.post('/request/connection/:Id', sendConnectionRequest);

userProfileRouter.post('/connection/:profileId', connection);

export default userProfileRouter;