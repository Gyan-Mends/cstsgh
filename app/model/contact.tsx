import mongoose from "~/mongoose.server";
import type { ContactInterface } from "~/components/interface";

const contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: 'contacts'
});

let Contact: mongoose.Model<ContactInterface>;

// Delete the model if it exists to ensure fresh registration
if (mongoose.models.Contact) {
    delete mongoose.models.Contact;
}

// Also check for different casing
if (mongoose.models.contact) {
    delete mongoose.models.contact;
}

Contact = mongoose.model<ContactInterface>("Contact", contactSchema);

export default Contact;
