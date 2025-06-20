import mongoose from "~/mongoose.server";
import type { UsersInterface } from "../components/interface";



const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true, // Corresponds to "role" in the form
    },
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'admin',
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Optionally stores the raw file data as a buffer
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

let User: mongoose.Model<UsersInterface>;

try {
    User = mongoose.model<UsersInterface>("User");
} catch (error) {
    User = mongoose.model<UsersInterface>("User", UserSchema);
}

export default User;
