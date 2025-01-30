import mongoose, { Schema } from "mongoose";

export interface IEvent {
    owner?: mongoose.Types.ObjectId;
    participants?: mongoose.Types.ObjectId[];
    catagory?: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    _id?: mongoose.Types.ObjectId;
}

const eventSchema: Schema<IEvent> = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    participants: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
});

const Event = mongoose.model<IEvent>('events', eventSchema);

export default Event;