import { type ActionFunction, type LoaderFunction } from "react-router";
import Blog from "~/model/blog";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const blog = await Blog.findById(id).populate("category admin");
      if (!blog) {
        return Response.json({ success: false, message: "Blog not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: blog });
    }

    const blogs = await Blog.find().populate("category admin").sort({ createdAt: -1 });
    return Response.json({ success: true, data: blogs });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch blogs" }, { status: 500 });
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
        const blogData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          image: formData.get("image") as string,
          category: formData.get("category") as string,
          admin: formData.get("admin") as string,
          status: formData.get("status") as string || "draft",
        };

        const newBlog = new Blog(blogData);
        await newBlog.save();
        
        return Response.json({ success: true, message: "Blog created successfully", data: newBlog });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          image: formData.get("image") as string,
          category: formData.get("category") as string,
          admin: formData.get("admin") as string,
          status: formData.get("status") as string,
        };

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedBlog) {
          return Response.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Blog updated successfully", data: updatedBlog });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        
        if (!deletedBlog) {
          return Response.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Blog deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 