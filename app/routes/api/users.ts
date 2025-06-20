import { type ActionFunction, type LoaderFunction } from "react-router";
import User from "~/model/users";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const user = await User.findById(id).select("-password");
      if (!user) {
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: user });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return Response.json({ success: true, data: users });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
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
        const userData = {
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          position: formData.get("position") as string,
          role: formData.get("role") as string,
          password: formData.get("password") as string,
          image: formData.get("image") as string,
        };

        const newUser = new User(userData);
        await newUser.save();
        
        return Response.json({ success: true, message: "User created successfully", data: newUser });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          position: formData.get("position") as string,
          role: formData.get("role") as string,
          image: formData.get("image") as string,
        };

        if (formData.get("password")) {
          (updateData as any).password = formData.get("password") as string;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        
        if (!updatedUser) {
          return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "User updated successfully", data: updatedUser });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
          return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "User deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 