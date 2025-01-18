
import Router from 'express';
import usersController from '../controllers/users_controller';
import { authMiddleware } from '../middleware/auth_middleware';

const router = Router();
router.get("/", authMiddleware, usersController.getById.bind(usersController));
router.put('/', authMiddleware, usersController.updateItem.bind(usersController));

export default router;

/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/
//* ************************************** User Schema *******************************************
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         address:
 *           type: string
 *           description: The user's address
 *         dateOfBirth:
 *           type: string
 *           description: The user's date of birth
 *         refreshTokens:
 *           type: string
 *           description: The user's refresh tokens
 *         _id:
 *           type: string
 *           description: The user's ID
 */

//* ************************************** Get user by ID *******************************************
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */

//* ************************************** Update user *******************************************
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Internal server error
 */
