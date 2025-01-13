import mongoose, { Schema } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    refreshTokens?: string[];
    _id?: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: null },
    address: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    refreshTokens: { type: [String], default: [] }
});

const User = mongoose.model<IUser>('users', userSchema);
export default User;