import Router from 'express';
import eventsController from '../controllers/events_controller';
import { authMiddleware } from '../middleware/auth_middleware';
import { ownershipMiddleware } from '../middleware/ownership_middleware';
import Event from '../models/event_model';

const router = Router();
router.get("/", eventsController.getAll.bind(eventsController));
router.get('/:id', eventsController.getById.bind(eventsController));
router.post('/', authMiddleware, eventsController.createIteam.bind(eventsController));
router.put('/:id', authMiddleware, ownershipMiddleware(Event), eventsController.updateIteam.bind(eventsController));
router.delete('/:id', authMiddleware, ownershipMiddleware(Event), eventsController.deleteIteam.bind(eventsController));

export default router;