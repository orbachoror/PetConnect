import express from 'express';
import commentsController from '../controllers/comments_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import { ownershipMiddleware } from '../middleware/ownership_middleware';
import Comment from '../models/comment_model';
const router = express.Router({ mergeParams: true });

router.get('/', commentsController.getAll.bind(commentsController));
router.get('/:id', commentsController.getById.bind(commentsController));
router.post('/', authMiddleware, commentsController.createItem.bind(commentsController));
router.put('/:id', authMiddleware, ownershipMiddleware(Comment), commentsController.updateItem.bind(commentsController));
router.delete('/:id', authMiddleware, ownershipMiddleware(Comment), commentsController.deleteItem.bind(commentsController));

export default router;