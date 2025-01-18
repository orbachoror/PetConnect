import Router from 'express';
import usersController from '../controllers/users_controller';
import { authMiddleware } from '../middleware/auth_middleware';

const router = Router();
router.get("/", authMiddleware, usersController.getById.bind(usersController));
router.put('/', authMiddleware, usersController.updateItem.bind(usersController));

export default router;