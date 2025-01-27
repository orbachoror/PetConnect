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

    async getAll(req: Request, res: Response): Promise<void> {
        try{
            const page = parseInt(req.query.page as string, 10) || 1; //default page 1 , 10  is decimele
            const limit = parseInt(req.query.limit as string, 10) || 10;  //default limit 10 , 10  is decimele

            const skip =(page-1)*limit; //how many posts to skip 
            const posts =await PostModel.find()
            .sort({_id:-1}) //sort by id in descending order
            .skip(skip)
            .limit(limit)
            .populate(populateOptions);
            const totalPosts =await PostModel.countDocuments();

            res.status(200).json({
                data:posts,
                pagination:{
                    currentPage:page,
                    totalPages:Math.ceil(totalPosts/limit),
                    totalPosts:totalPosts
                },
            });
        }catch(error){
            res.status(500).send("Error getting posts"+error);
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
}

const postsController = new PostsController();
export default postsController;
