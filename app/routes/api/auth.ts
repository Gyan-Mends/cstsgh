import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "~/mongoose.server";
import Users from "~/model/users";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function action({ request }: { request: Request }) {
  try {
    await connectDB;
    
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate required fields
    if (!email || !password) {
      return Response.json({
        success: false,
        message: "Email and password are required"
      }, { status: 400 });
    }

    // Find user by email
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({
        success: false,
        message: "Invalid email or password"
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json({
        success: false,
        message: "Invalid email or password"
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role || 'staff',
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response with user data (excluding password)
    return Response.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          position: user.position,
          role: user.role || 'staff',
          base64Image: user.base64Image
        },
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
} 