import PostModel, { IPost } from "../models/posts_model";
import CommentModel from "../models/comment_model";
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { BaseController } from './base_controller'

const populateOptions = { path: 'owner', select: 'email' }
const postsUploadPath = 'uploads/posts_pictures/';
class PostsController extends BaseController<IPost> {
    constructor() {
        super(PostModel, populateOptions);
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const skip = (page - 1) * limit;
            const category = req.query.category as string;
            const sortBy = req.query.sortBy as string;
            const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

            const filter: any = {};
            if (category && category !== "All") {
                filter.category = category;
            }

            let sortOptions: any = { _id: -1 }; // Default: newest post first
            if (sortBy === "likes") {
                sortOptions = { likes: sortOrder };
            }

            const posts = await PostModel.find(filter)
                .populate("owner", "name email")
                .sort(sortOptions)
                .lean(); // converts Mongoose objects to plain JS objects for better performance

            // we count the comments for each post and insert it in the post object to be used in the frontend
            for (const post of posts)
                post.commentCount = await CommentModel.countDocuments({ postId: post._id });

            // if the sorting is by comments we sort the posts array by the comment count
            if (sortBy === "comments") {
                posts.sort((a, b) =>
                    (sortOrder === 1 ? a.commentCount - b.commentCount : b.commentCount - a.commentCount));
            }

            // we making the pagging here and not right after the find because we need the comment count to be calculated first
            const paginatedPosts = posts.slice(skip, skip + limit);

            const totalPosts = await PostModel.countDocuments(filter);

            res.status(200).json({
                data: paginatedPosts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts: totalPosts,
                },
            });
        } catch (error) {
            res.status(500).send("Error getting posts: " + error);
        }
    }



    async createItem(req: Request, res: Response): Promise<void> {
        if (req.file)
            req.body.postPicture = `${postsUploadPath}${req.file.filename}`;
        await super.createItem(req, res);
    };

    async updateItem(req: Request, res: Response): Promise<void> {
        if (req.file)
            req.body.postPicture = `${postsUploadPath}${req.file.filename}`;
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

            const isLiked = post.likedBy.includes(userId);

            if (isLiked) {
                post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
                post.likes -= 1;
            } else {
                post.likedBy.push(userId);
                post.likes += 1;
            }
            await post.save();
            res.status(200).send({ likes: post.likes, likedBy: post.likedBy, isLiked: !isLiked });
        } catch (error) {
            logger.error("Error toggling like:" + error);
            res.status(500).send("Error toggling like" + error);
        }
    };
    async deleteItem(req: Request, res: Response): Promise<void> {
        const postId = req.params.id;
        if (!postId) {
            logger.error("Post not found");
            throw new Error("Post not found");
        }
        try {
            const post = await PostModel.deleteOne({ _id: postId });
            if (post.deletedCount === 0) {
                logger.error("Post not found");
                throw new Error("Post not found");
            }
            await CommentModel.deleteMany({ postId: postId });
            res.status(200).json({ messege: "Post deleted successfully" });

        } catch (error) {
            logger.error("Error deleting post:" + error);
            res.status(500).json({ messege: "Error deleting post" + error });
        }
    }

}

const postsController = new PostsController();
export default postsController;
