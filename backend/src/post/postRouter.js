import express from 'express';
import { post } from './postController.js';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 3e7 }
});

postRouter.post('/', upload.fields([{name: 'postImgs', maxCount: 1}]) , post);

export default postRouter;