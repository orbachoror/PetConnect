import mongoose, { Schema } from "mongoose";

export interface IComment {
    owner?: Schema.Types.ObjectId;
    postId?: Schema.Types.ObjectId;
    content: string;
    _id?: mongoose.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new mongoose.Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'posts', required: true },
    content: { type: String, required: true }
});

const Comment = mongoose.model<IComment>('comments', commentSchema);

export default Comment;