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

export const action: ActionFunction = async ({ request }) => {
  try {
    const method = request.method;

    switch (method) {
      case "POST": {
        const body = await request.json();
        
        // Validate required fields
        if (!body.password) {
          return Response.json({ success: false, message: "Password is required" }, { status: 400 });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        const userData = {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          position: body.position,
          role: body.role,
          password: hashedPassword,
          image: body.image || "",
        };

        const newUser = new User(userData);
        const savedUser = await newUser.save();
        
        // Return user data without password
        const userResponse = savedUser.toObject();
        const { password: _, ...userWithoutPassword } = userResponse;
        
        return Response.json({ success: true, message: "User created successfully", data: userWithoutPassword });
      }

      case "PUT": {
        const body = await request.json();
        const id = body.id;
        
        const updateData: any = {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          position: body.position,
          role: body.role,
        };

        // Only update image if provided
        if (body.image) {
          updateData.image = body.image;
        }

        // Hash password if provided
        if (body.password && body.password.trim() !== "") {
          const saltRounds = 12;
          updateData.password = await bcrypt.hash(body.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        
        if (!updatedUser) {
          return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "User updated successfully", data: updatedUser });
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
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