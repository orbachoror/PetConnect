import postsController from '../controllers/posts_controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth_middleware';
import { ownershipMiddleware } from '../middleware/ownership_middleware';
import Post  from '../models/posts_model';  

const router = express.Router();

router.get("/",postsController.getAll.bind(postsController));
router.get('/:id', postsController.getById.bind(postsController));
router.post('/',authMiddleware,postsController.createIteam.bind(postsController));
router.put('/:id',authMiddleware,ownershipMiddleware(Post),postsController.updateIteam.bind(postsController));
router.delete('/:id',authMiddleware,ownershipMiddleware(Post),postsController.deleteIteam.bind(postsController));

export default router;

