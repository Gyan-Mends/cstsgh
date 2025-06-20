import { Schema } from "mongoose";
import type { DirectorsBankInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const DirectorsBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    areasOfExpertise: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});

let DirectorsBank: mongoose.Model<DirectorsBankInterface>;

try {
    DirectorsBank = mongoose.model<DirectorsBankInterface>("directorsBank");
} catch (error) {
    DirectorsBank = mongoose.model<DirectorsBankInterface>("directorsBank", DirectorsBankSchema);
}

export default DirectorsBank;
