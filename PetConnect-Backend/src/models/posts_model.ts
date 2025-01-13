import mongoose, {Schema} from "mongoose";

export interface IPost{
    owner: string,
    title: string,
    description: string,
    _id?: string
}

const postSchema: Schema<IPost> = new mongoose.Schema({
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
