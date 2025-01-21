import authController from '../controllers/auth_controller';
import express from 'express';
import { createUploadMiddleware } from '../middleware/image_upload_middleware';

const router = express.Router();
router.post('/register', createUploadMiddleware("users_pictures"), (req, res, next) => {
    console.log("Multer processed file:", req.file);
    console.log("Request body:", req.body);
    next();
}, authController.register); router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

//**************************************Security Schemes*******************************************
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

//***************************************User Schema********************************************
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
 *           format: date
 *           description: The user's date of birth
 *         refreshTokens:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of refresh tokens issued to the user
 *       example:
 *         name: "Bob Smith"
 *         email: "bob@gmail.com"
 *         password: "123456"
 *         phone: "123-456-7890"
 *         address: "123 Main St, Anytown, USA"
 *         dateOfBirth: "1990-01-01"
 *         refreshTokens:
 *           - "token1"
 *           - "token2"
 */

//***************************************Register******************************************
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
//***************************************Login********************************************
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email
 *               password:
 *                 type: string
 *                 description: The user password
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "bob@gmail.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
/***************************************Logout********************************************
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the user
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: refreshToken
 *         required: true
 *         description: The refreshToken of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: "User successfully logged out"
 *       400:
 *         description: Bad request, token is missing or invalid
 *       401:
 *         description: Unauthorized, user is not authenticated or token is invalid
 *       500:
 *         description: Internal server error
 */

