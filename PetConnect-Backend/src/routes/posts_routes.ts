import postsController from '../controllers/posts_controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth_middleware';

const router = express.Router();

router.get("/",postsController.getAll.bind(postsController));
router.get('/:id', postsController.getById.bind(postsController));
router.post('/',authMiddleware,postsController.createIteam.bind(postsController));
router.put('/:id',authMiddleware,postsController.updateIteam.bind(postsController));
router.delete('/:id',authMiddleware,postsController.deleteIteam.bind(postsController));

export default router;

