import PostModel,{IPost} from "../models/posts_model";
import BaseController  from "./base_controller";

const postsController = BaseController<IPost>(PostModel);


export default postsController;

