import { Schema } from "mongoose";
import type { BlogInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const BlogSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    image: {
        required: true,
        type: String,
    },
    category: {
        ref: "category",
        required: true,
        type: Schema.Types.ObjectId,
    },
    admin: {
        ref: "User",
        // required: true,
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ['draft', 'review', 'published'],
        default: 'draft',
    },
}, {
    timestamps: true
})

let Blog: mongoose.Model<BlogInterface>

try {
    Blog = mongoose.model<BlogInterface>("blog")
} catch (error) {
    Blog = mongoose.model<BlogInterface>("blog", BlogSchema)

}

export default Blog