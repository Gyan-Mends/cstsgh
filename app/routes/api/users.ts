import { type ActionFunction, type LoaderFunction } from "react-router";
import bcrypt from "bcryptjs";
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

// Helper function to convert File to base64 string
const fileToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const method = request.method;
    const _method = formData.get("_method") as string;
    
    const actionMethod = _method || method;

    switch (actionMethod) {
      case "POST": {
        const imageFile = formData.get("image") as File | null;
        let imageData = "";
        
        if (imageFile && imageFile.size > 0) {
          imageData = await fileToBase64(imageFile);
        }

        const password = formData.get("password") as string;
        
        // Validate required fields
        if (!password) {
          return Response.json({ success: false, message: "Password is required" }, { status: 400 });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = {
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          position: formData.get("position") as string,
          role: formData.get("role") as string,
          password: hashedPassword,
          base64Image: imageData, // Use base64Image field as per model
        };

        const newUser = new User(userData);
        const savedUser = await newUser.save();
        
        // Return user data without password
        const userResponse = savedUser.toObject();
        const { password: _, ...userWithoutPassword } = userResponse;
        
        return Response.json({ success: true, message: "User created successfully", data: userWithoutPassword });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const imageFile = formData.get("image") as File | null;
        
        const updateData: any = {
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          position: formData.get("position") as string,
          role: formData.get("role") as string,
        };

        // Only update image if a new file is provided
        if (imageFile && imageFile.size > 0) {
          updateData.base64Image = await fileToBase64(imageFile);
        }

        // Hash password if provided
        const newPassword = formData.get("password") as string;
        if (newPassword && newPassword.trim() !== "") {
          const saltRounds = 12;
          updateData.password = await bcrypt.hash(newPassword, saltRounds);
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