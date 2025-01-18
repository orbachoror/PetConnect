import PostModel, { IPost } from "../models/posts_model";
import createController from "./base_controller";

const populateOptions = { path: 'owner', select: 'email' }
const postsController = createController<IPost>(PostModel, populateOptions);


export default postsController;

