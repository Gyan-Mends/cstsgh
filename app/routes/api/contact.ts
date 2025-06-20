import { type ActionFunction, type LoaderFunction } from "react-router";
import Contact from "~/model/contact";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const contact = await Contact.findById(id);
      if (!contact) {
        return Response.json({ success: false, message: "Contact not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: contact });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: contacts });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch contacts" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const method = request.method;
    const _method = formData.get("_method") as string;
    
    const actionMethod = _method || method;

    switch (actionMethod) {
      case "POST": {
        const contactData = {
          fullname: formData.get("fullname") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          message: formData.get("message") as string,
        };

        const newContact = new Contact(contactData);
        await newContact.save();
        
        return Response.json({ success: true, message: "Contact created successfully", data: newContact });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          fullname: formData.get("fullname") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          message: formData.get("message") as string,
        };

        const updatedContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedContact) {
          return Response.json({ success: false, message: "Contact not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Contact updated successfully", data: updatedContact });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedContact = await Contact.findByIdAndDelete(id);
        
        if (!deletedContact) {
          return Response.json({ success: false, message: "Contact not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Contact deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 