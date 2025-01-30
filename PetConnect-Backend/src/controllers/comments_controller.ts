import { BaseController } from './base_controller'
import Comment, { IComment } from '../models/comment_model'
import { Request, Response } from 'express';
import logger from '../utils/logger';
import base_services from '../services/base_services';
import Post from '../models/posts_model';

const populateOptions = { path: 'owner', select: 'email' }

class CommentsController extends BaseController<IComment> {
    constructor() {
        super(Comment, populateOptions);
    }
    async createItem(req: Request, res: Response): Promise<void> {
        try {
            const postId = req.params.postId;
            logger.info("postId in comments controller " + postId);
            if (!postId) {
                logger.error("post ID is required");
                res.status(400).send("post ID is required");
                return;
            }
            const post = await base_services.getById(Post, postId);
            if (!post) {
                logger.error("Cannot find post with id " + postId);
                res.status(400).send("Cannot find post to comment ");
                return;
            }
            const { content } = req.body;
            if (!content) {
                logger.error("content is required in comment ");
                res.status(400).send("content is required ");
                return;
            }
            req.body = { ...req.body, postId }
            await super.createItem(req, res);
        } catch (err) {
            logger.error("Error in create comment" + err);
            res.status(500).send("Error in create comment" + err);
        }
    }
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const postId = req.params.postId;
            if (!postId) {
                logger.error("post ID is required");
                res.status(400).send("post ID is required");
                return;
            }

            if (req.query.countOnly === "true") {
                const count = await Comment.countDocuments({ postId });
                res.status(200).json({ count });
                return;
            }
            const post = await base_services.getById(Post, postId);
            if (!post) {
                logger.error("Cannot find post with id " + postId);
                res.status(400).send("Cannot find post to comment ");
                return;
            }

            req.query = { postId }
            await super.getAll(req, res);
        } catch (err) {
            logger.error("Error in get all comments" + err);
            res.status(500).send("Error in get all comments" + err);
        }
    }
    async updateItem(req: Request, res: Response): Promise<void> {
        for (const key in req.body) {
            if (key !== 'content') {
                logger.error("You can only update content in comment");
                res.status(400).send("You can only update content in comment");
                return;
            }
        }
        await super.updateItem(req, res);
    }
}


export default new CommentsController();