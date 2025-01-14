import Router from 'express';
import eventsController from '../controllers/events_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import { ownershipMiddleware } from '../middleware/ownership_middleware';
import Event from '../models/event_model';

const router = Router();
router.get("/", eventsController.getAll.bind(eventsController));
router.get('/:id', eventsController.getById.bind(eventsController));
router.post('/', authMiddleware, eventsController.createItem.bind(eventsController));
router.put('/:id', authMiddleware, ownershipMiddleware(Event), eventsController.updateItem.bind(eventsController));
router.delete('/:id', authMiddleware, ownershipMiddleware(Event), eventsController.deleteItem.bind(eventsController));

export default router;