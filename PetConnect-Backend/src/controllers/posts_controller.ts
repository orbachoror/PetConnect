import PostModel,{IPost} from "../models/posts_model";
import createController  from "./base_controller";

const postsController = createController<IPost>(PostModel);


export default postsController;

