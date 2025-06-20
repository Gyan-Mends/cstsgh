import { Schema } from "mongoose";
import type { TrainingInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const TrainingSchema = new mongoose.Schema({
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
    duration: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    trainingTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainingtype',
        required: false,
    },
}, {
    timestamps: true,
});

let Training: mongoose.Model<TrainingInterface>;

try {
    Training = mongoose.model<TrainingInterface>("training");
} catch (error) {
    Training = mongoose.model<TrainingInterface>("training", TrainingSchema);
}

export default Training;
