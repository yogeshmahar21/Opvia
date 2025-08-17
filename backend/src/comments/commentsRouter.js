import express from 'express';
import { getCommentById, deleteComment, createComment } from './commentsController.js';
import Auth from '../middleware/Auth.js';

const commentsRouter = express.Router();

commentsRouter.post('/:writerId/:postId', Auth, createComment);

commentsRouter.get('/:id', getCommentById);

commentsRouter.delete('/:id', Auth, deleteComment);

export default commentsRouter;