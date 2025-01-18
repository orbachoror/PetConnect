import mongoose, { Schema } from "mongoose";

export interface IPost {
    owner?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    postImage?: string,
    _id?: mongoose.Types.ObjectId,
    likes: number;
    likedBy: string[];
}

const postSchema: Schema<IPost> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String, ref: "users" }],
    postImage: { type: String, default: null }
});

const Post = mongoose.model<IPost>('posts', postSchema);
export default Post;
