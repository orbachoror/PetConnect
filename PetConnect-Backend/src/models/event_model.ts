import mongoose, { Schema } from "mongoose";

export interface IEvent {
    owner?: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    _id?: mongoose.Types.ObjectId;
}

const eventSchema: Schema<IEvent> = new mongoose.Schema({
    owner: { type: String, ref: 'users' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true }
});

const Event = mongoose.model<IEvent>('events', eventSchema);

export default Event;