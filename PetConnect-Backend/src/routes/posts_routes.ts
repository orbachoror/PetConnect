import postsController from '../controllers/posts_controller';
import express from 'express';
import { authMiddleware } from '../middleware/auth_middleware';
import { ownershipMiddleware } from '../middleware/ownership_middleware';
import { createUploadMiddleware } from '../middleware/image_upload_middleware';
import Post from '../models/posts_model';
const router = express.Router();

router.get("/", postsController.getAll.bind(postsController));
router.get('/:id', postsController.getById.bind(postsController));
router.post('/', authMiddleware, createUploadMiddleware("posts_pictures"), postsController.createItem.bind(postsController));
router.put('/:postId/like', authMiddleware, postsController.toggleLike.bind(postsController));
router.put('/:id', authMiddleware, ownershipMiddleware(Post), createUploadMiddleware("posts_pictures"), postsController.updateItem.bind(postsController));
router.delete('/:id', authMiddleware, ownershipMiddleware(Post), postsController.deleteItem.bind(postsController));

export default router;
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**************************************Post Schema*******************************************/
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - likes
 *         - likedBy
 *       properties:
 *         owner:
 *           type: string
 *           description: The owner of the post (User ID)
 *         title:
 *           type: string
 *           description: The title of the post
 *         description:
 *           type: string
 *           description: The content or description of the post
 *         postPicture:
 *          type: string
 *          format: binary
 *          description: The post picture
 *         likes:
 *           type: number
 *           description: The number of likes the post has received
 *           default: 0
 *           readOnly: true
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who liked the post
 *           default: []
 *           readOnly: true      
 */
/**************************************Get all posts*******************************************/
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**************************************Get post by id*******************************************/
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**************************************Create post*******************************************/
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *           example:
 *             owner: "orbach"
 *             title: "Post Title"
 *             description: "This is a post!"
 *             postPicture: "../tests/test_image.png"
 *     responses:
 *       200:
 *         description: Post successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
/**************************************Update post*******************************************/
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by its ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**************************************Delete post*******************************************/
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**************************************Like post*******************************************/
/**
 * @swagger
 * /posts/{postId}/like:
 *   put:
 *     summary: Like a post
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The post id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post successfully liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
