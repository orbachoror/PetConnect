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

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */
// ************************************** Comment Schema *******************************************
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         postId:
 *           type: ObjectId
 *           description: The post ID
 *         owner:
 *           type: string
 *           description: The user ID
 */
// ************************************** Get all comments *******************************************
/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post for which to fetch comments
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *     responses:
 *       200:
 *         description: List of all comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */

// ************************************** Get comment by ID *******************************************
/**
 * @swagger
 * /posts/{postId}/comments/{id}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to which the comment belongs
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *       - in: path
 *         name: id
 *         required: true
 *         description: The comment ID
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */


// ************************************** Create a comment *******************************************
/**
* @swagger
* /posts/{postId}/comments:
*   post:
*     summary: Add a new comment
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         description: The ID of the post to which the comment belongs
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               content:
*                 type: string
*                 description: The content of the comment
*                 example: "This is a new comment!"
*     responses:
*       200:
*         description: The comment was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/
// ************************************** Update a comment *******************************************
/**
 * @swagger
 * /posts/{postId}/comments/{id}:
 *   put:
 *     summary: Update an existing comment by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to which the comment belongs
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment
 *                 example: "This is an updated comment!"
 *     responses:
 *       200:
 *         description: The comment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

// ************************************** Delete a comment *******************************************
/**
 * @swagger
 * /posts/{postId}/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to which the comment belongs
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109cd"
 *     responses:
 *       200:
 *         description: The comment was successfully deleted
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */