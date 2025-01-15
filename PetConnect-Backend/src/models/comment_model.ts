import mongoose, { Schema } from "mongoose";

export interface IComment {
    owner?: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId;
    content: string;
    _id?: mongoose.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'posts', required: true },
    content: { type: String, required: true }
});

const Comment = mongoose.model<IComment>('comments', commentSchema);

export default Comment;