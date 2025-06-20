import { Schema } from "mongoose";
import type { GalleryInterface } from "~/components/interface";
import mongoose from "~/mongoose.server";

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
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

let Gallery: mongoose.Model<GalleryInterface>;

try {
    Gallery = mongoose.model<GalleryInterface>("gallery");
} catch (error) {
    Gallery = mongoose.model<GalleryInterface>("gallery", GallerySchema);
}

export default Gallery;
