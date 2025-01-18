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


/**
* @swagger
* tags:
*   name: Events
*   description: The Events API
*/
// ************************************** Event Schema *******************************************
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *       properties:
 *         title:
 *           type: string
 *           description: The event title
 *         description:
 *           type: string
 *           description: The event description
 *         date:
 *           type: string
 *           format: date
 *           description: The event date
 *         location:
 *           type: string
 *           description: The event location
 *         owner:
 *           type: string
 *           description: The user ID
 */
// ************************************** Get all events *******************************************
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
// ************************************** Get event by ID *******************************************
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to fetch
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *     responses:
 *       200:
 *         description: The event
 */
// ************************************** Create event *******************************************
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *           example:
 *             title: "Event Title"
 *             description: "Event Description"
 *             date: "2021-06-22T00:00:00.000Z"
 *             location: "Event Location"
 *     responses:
 *       200:
 *         description: The event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

// ************************************** Update event *******************************************
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *           example:
 *             title: "Event Title updated"
 *             description: "Event Description updated"
 *             date: "2021-06-22T00:00:00.000Z"
 *             location: "Event Location updated"
 *     responses:
 *       200:
 *         description: The event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
// ************************************** Delete event *******************************************
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The event was deleted
 */