import { useState, useEffect } from "react";
import { User, Mail, Phone, Briefcase, Lock, Eye, EyeOff, Camera } from "lucide-react";
import CustomInput from "~/components/CustomInput";
import { Button, Select, SelectItem } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import { getUserData, type UserData } from "~/utils/auth";
import type { LoaderFunction } from "react-router";

export const meta = () => {
  return [
    { title: "Settings - CSTS Admin" },
    { name: "description", content: "Manage your profile settings and password" },
  ];
};

export const loader: LoaderFunction = async () => {
  // Simple loader that returns empty data since we handle auth client-side
  return new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
  });
};

// Helper function to update user data in localStorage
const updateUserData = (userData: UserData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem("userData", JSON.stringify(userData));
};

const Settings = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    role: "admin" as "admin" | "staff",
    image: null as File | null,
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
      setProfileData({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        position: userData.position,
        role: userData.role || "admin",
        image: null,
      });
    }
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!profileData.fullName || !profileData.email || !profileData.phone || !profileData.position) {
        errorToast("Please fill in all required fields");
        return;
      }
      
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("id", user?._id || "");
      form.append("fullName", profileData.fullName);
      form.append("email", profileData.email);
      form.append("phone", profileData.phone);
      form.append("position", profileData.position);
      form.append("role", profileData.role);
      
      // Handle file upload
      if (profileData.image) {
        form.append("image", profileData.image);
      }

      const response = await fetch("/api/users", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local storage with new user data
        const updatedUser: UserData = {
          _id: user?._id || "",
          fullName: data.data.fullName,
          email: data.data.email,
          phone: data.data.phone,
          position: data.data.position,
          role: data.data.role,
          base64Image: data.data.base64Image,
        };
        updateUserData(updatedUser);
        setUser(updatedUser);
        
        // Reset image file input
        setProfileData(prev => ({ ...prev, image: null }));
        
        successToast("Profile updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate password fields
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        errorToast("Please fill in all password fields");
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        errorToast("New passwords do not match");
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        errorToast("New password must be at least 6 characters long");
        return;
      }

      // First verify current password by attempting login
      const loginResponse = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          password: passwordData.currentPassword,
        }),
      });

      const loginData = await loginResponse.json();
      
      if (!loginData.success) {
        errorToast("Current password is incorrect");
        return;
      }

      // Update password
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("id", user?._id || "");
      form.append("fullName", user?.fullName || "");
      form.append("email", user?.email || "");
      form.append("phone", user?.phone || "");
      form.append("position", user?.position || "");
      form.append("role", user?.role || "admin");
      form.append("password", passwordData.newPassword);

      const response = await fetch("/api/users", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset password form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        successToast("Password changed successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.base64Image ? (
                      <img 
                        src={user.base64Image} 
                        alt={user.fullName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-xl">
                        {getUserInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera size={12} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProfileData({ ...profileData, image: file });
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click the camera icon to update your photo</p>
                </div>
              </div>

              <CustomInput
                label="Full Name"
                type="text"
                isRequired={true}
                name="fullName"
                placeholder="Enter full name"
                value={profileData.fullName}
                onChange={(e: any) => setProfileData({ ...profileData, fullName: e.target.value })}
                endContent={<User size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
              />

              <CustomInput
                label="Email"
                type="email"
                isRequired={true}
                name="email"
                placeholder="Enter email address"
                value={profileData.email}
                onChange={(e: any) => setProfileData({ ...profileData, email: e.target.value })}
                endContent={<Mail size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
              />

              <CustomInput
                label="Phone"
                type="tel"
                isRequired={true}
                name="phone"
                placeholder="Enter phone number"
                value={profileData.phone}
                onChange={(e: any) => setProfileData({ ...profileData, phone: e.target.value })}
                endContent={<Phone size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
              />

              <CustomInput
                label="Position"
                type="text"
                isRequired={true}
                name="position"
                placeholder="Enter job position"
                value={profileData.position}
                onChange={(e: any) => setProfileData({ ...profileData, position: e.target.value })}
                endContent={<Briefcase size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
              />

              <Select
                label="Role"
                placeholder="Select user role"
                selectedKeys={[profileData.role]}
                onSelectionChange={(keys) => {
                  const selectedRole = Array.from(keys)[0] as "admin" | "staff";
                  setProfileData({ ...profileData, role: selectedRole });
                }}
                variant="bordered"
                isRequired
                classNames={{
                  label: "font-nunito text-sm !text-white",
                  trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
                  value: "text-gray-400"
                }}
              >
                <SelectItem key="admin">Admin</SelectItem>
                <SelectItem key="staff">Staff</SelectItem>
              </Select>

              <Button
                type="submit"
                color="primary"
                className="w-full bg-blue-600 hover:bg-blue-700"
                isLoading={loading}
                isDisabled={loading}
              >
                Update Profile
              </Button>
            </form>
          </div>
        </div>

        {/* Password Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <CustomInput
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                isRequired={true}
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e: any) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-default-400 hover:text-default-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="space-y-2">
                <CustomInput
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  isRequired={true}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e: any) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-default-400 hover:text-default-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters long
                </p>
              </div>

              <CustomInput
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                isRequired={true}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e: any) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-default-400 hover:text-default-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex">
                  <Lock className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Password Security Tips
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Use at least 8 characters</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Add numbers and special characters</li>
                        <li>Avoid common words or personal information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full bg-blue-600 hover:bg-blue-700"
                isLoading={loading}
                isDisabled={loading}
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{user._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</label>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === "admin" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
