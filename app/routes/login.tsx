import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import { Button } from "@heroui/react";
import CustomInput from "~/components/CustomInput";
import { successToast, errorToast } from "~/components/toast";

export const meta = () => {
  return [
    { title: "Login - CSTS Admin" },
    { name: "description", content: "Login to access the CSTS admin dashboard" },
  ];
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token is still valid by checking expiration
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenData.exp > currentTime) {
          // Token is still valid, redirect to dashboard
          navigate("/dashboard");
        } else {
          // Token expired, remove it
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      } catch (error) {
        // Invalid token, remove it
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      errorToast("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      errorToast("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);

      const response = await fetch("/api/auth", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        
        successToast("Login successful! Redirecting...");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        errorToast(data.message || "Login failed");
      }
    } catch (error) {
      errorToast("Network error. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to CSTS
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <CustomInput
                label="Email Address"
                type="email"
                name="email"
                isRequired={true}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                endContent={<Mail size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
              />
            </div>

            <div>
              <CustomInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                isRequired={true}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                endContent={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                startContent={!loading && <LogIn size={18} />}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This is a secure admin area. Only authorized personnel may access this system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 CSTS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 