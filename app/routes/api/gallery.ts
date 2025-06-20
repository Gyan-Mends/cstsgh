import { type ActionFunction, type LoaderFunction } from "react-router";
import Gallery from "~/model/gallery";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const gallery = await Gallery.findById(id);
      if (!gallery) {
        return Response.json({ success: false, message: "Gallery item not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: gallery });
    }

    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: galleryItems });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch gallery items" }, { status: 500 });
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
        const galleryData = {
          title: formData.get("title") as string,
          type: formData.get("type") as string,
          image: formData.get("image") as string,
        };

        const newGallery = new Gallery(galleryData);
        await newGallery.save();
        
        return Response.json({ success: true, message: "Gallery item created successfully", data: newGallery });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          title: formData.get("title") as string,
          type: formData.get("type") as string,
          image: formData.get("image") as string,
        };

        const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedGallery) {
          return Response.json({ success: false, message: "Gallery item not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Gallery item updated successfully", data: updatedGallery });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedGallery = await Gallery.findByIdAndDelete(id);
        
        if (!deletedGallery) {
          return Response.json({ success: false, message: "Gallery item not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Gallery item deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 