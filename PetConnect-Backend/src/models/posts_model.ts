import mongoose, { Schema } from "mongoose";

export interface IPost {
    owner?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    postPicture?: string,
    _id?: mongoose.Types.ObjectId,
    likes: number;
    likedBy: string[];
    category: string;
    commentCount: number
}

const postSchema: Schema<IPost> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String, ref: "users" }],
    postPicture: { type: String, default: null },
    category: { type: String, enum: ["General", "Product Recommendations", "Lost & Found", "Health Tips", "Trainer Recommendations", "Training Advice", "Adoption"], default: "General" },
});

const Post = mongoose.model<IPost>('posts', postSchema);
export default Post;
