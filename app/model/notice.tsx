import { Schema } from "mongoose";
import type { ComplianceNoticeInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
});

let Notice: mongoose.Model<ComplianceNoticeInterface>;

try {
    Notice = mongoose.model<ComplianceNoticeInterface>("notice");
} catch (error) {
    Notice = mongoose.model<ComplianceNoticeInterface>("notice", NoticeSchema);
}

export default Notice;
