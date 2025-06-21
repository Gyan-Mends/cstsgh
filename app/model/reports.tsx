import mongoose from "~/mongoose.server";
import type { ReportInterface } from "../components/interface";

const ReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Trade Forums',
            'Legal Conferences', 
            'Technology Conferences',
            'Government Meetings',
            'Business Roundtables',
            'Academic Conferences'
        ]
    },
    eventDate: {
        type: Date,
        required: true
    },
    filename: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: ''
    },
    fileSize: {
        type: Number,
        default: 0
    },
    filePath: {
        type: String,
        default: ''
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    eventLocation: {
        type: String,
        trim: true,
        maxlength: 200
    },
    eventOrganizer: {
        type: String,
        trim: true,
        maxlength: 200
    },
    summary: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    keyOutcomes: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

let Report: mongoose.Model<ReportInterface>;

try {
    Report = mongoose.model<ReportInterface>("Report");
} catch (error) {
    Report = mongoose.model<ReportInterface>("Report", ReportSchema);
}

export default Report; 