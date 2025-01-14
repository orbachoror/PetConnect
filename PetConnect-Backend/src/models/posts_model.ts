import mongoose, { Schema } from "mongoose";

export interface IPost {
    owner?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    _id?: mongoose.Types.ObjectId
}

const postSchema: Schema<IPost> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
