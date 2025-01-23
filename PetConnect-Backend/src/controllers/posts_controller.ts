import PostModel, { IPost } from "../models/posts_model";
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { BaseController } from './base_controller'

const populateOptions = { path: 'owner', select: 'email' }
const postsUploadPath = 'uploads/posts_pictures/';
class PostsController extends BaseController<IPost> {
    constructor() {
        super(PostModel, populateOptions);
    }

    async createItem(req: Request, res: Response): Promise<void> {
        req.body.postPicture = req.file ? `${postsUploadPath}${req.file.filename}` : null;
        await super.createItem(req, res);
    };
    async updateItem(req: Request, res: Response): Promise<void> {
        req.body.postPicture = req.file ? `${postsUploadPath}${req.file.filename}` : null;
        await super.updateItem(req, res);
    }

    async toggleLike(req: Request, res: Response): Promise<void> {
        const postId = req.params.postId;
        const userId = req.query.userId?.toString();

        if (!userId) {
            logger.error("User not found");
            throw new Error("User not found");
        }

        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                logger.error("Post not found");
                throw new Error("Post not found");
            }

            const alreadyLiked = post.likedBy.includes(userId);

            if (alreadyLiked) {
                post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
                post.likes -= 1;
            } else {
                post.likedBy.push(userId);
                post.likes += 1;
            }
            await post.save();
            res.status(200).send({ likes: post.likes, likedBy: post.likedBy });
        } catch (error) {
            logger.error("Error toggling like:" + error);
            res.status(500).send("Error toggling like" + error);
        }
    };
}

const postsController = new PostsController();
export default postsController;
