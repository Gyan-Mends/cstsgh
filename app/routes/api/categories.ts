import { type ActionFunction, type LoaderFunction } from "react-router";
import Category from "~/model/category";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const category = await Category.findById(id).populate("admin");
      if (!category) {
        return Response.json({ success: false, message: "Category not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: category });
    }

    const categories = await Category.find().populate("admin").sort({ createdAt: -1 });
    return Response.json({ success: true, data: categories });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
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
        const categoryData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          admin: formData.get("admin") as string,
        };

        const newCategory = new Category(categoryData);
        await newCategory.save();
        
        return Response.json({ success: true, message: "Category created successfully", data: newCategory });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          admin: formData.get("admin") as string,
        };

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedCategory) {
          return Response.json({ success: false, message: "Category not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Category updated successfully", data: updatedCategory });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedCategory = await Category.findByIdAndDelete(id);
        
        if (!deletedCategory) {
          return Response.json({ success: false, message: "Category not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Category deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 