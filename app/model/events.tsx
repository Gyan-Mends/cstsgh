import { Schema } from "mongoose";
import type { EventInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
   
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

let Event: mongoose.Model<EventInterface>;

try {
    Event = mongoose.model<EventInterface>("event");
} catch (error) {
    Event = mongoose.model<EventInterface>("event", EventSchema);
}

export default Event;
