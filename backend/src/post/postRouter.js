import express from 'express';
import { deletePost, post } from './postController.js';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Auth from '../middleware/Auth.js';
import { getPostById } from './postController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 3e7 }
});

postRouter.post('/', upload.fields([{name: 'postImg', maxCount: 1}]), Auth,  post);

postRouter.get('/get/:postId', getPostById );

postRouter.delete('/delete/:postId', Auth, deletePost);

export default postRouter;