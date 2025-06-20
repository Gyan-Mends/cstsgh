import { type ActionFunction, type LoaderFunction } from "react-router";
import Notice from "~/model/notice";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const notice = await Notice.findById(id);
      if (!notice) {
        return Response.json({ success: false, message: "Notice not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: notice });
    }

    const notices = await Notice.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: notices });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch notices" }, { status: 500 });
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
        const noticeData = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
        };

        const newNotice = new Notice(noticeData);
        await newNotice.save();
        
        return Response.json({ success: true, message: "Notice created successfully", data: newNotice });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
        };

        const updatedNotice = await Notice.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedNotice) {
          return Response.json({ success: false, message: "Notice not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Notice updated successfully", data: updatedNotice });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedNotice = await Notice.findByIdAndDelete(id);
        
        if (!deletedNotice) {
          return Response.json({ success: false, message: "Notice not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Notice deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 