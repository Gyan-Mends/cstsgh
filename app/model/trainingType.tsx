import { Schema } from "mongoose";
import type { TrainingTypeInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const TrainingTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

let TrainingType: mongoose.Model<TrainingTypeInterface>;

try {
    TrainingType = mongoose.model<TrainingTypeInterface>("trainingtype");
} catch (error) {
    TrainingType = mongoose.model<TrainingTypeInterface>("trainingtype", TrainingTypeSchema);
}

export default TrainingType; 