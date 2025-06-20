import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, User, Mail, Phone, Briefcase, Lock, ImageIcon } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import type { UsersInterface } from "~/components/interface";
import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Users Management - CSTS Admin" },
    { name: "description", content: "Manage users in the CSTS system" },
  ];
};

const Users = () => {
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersInterface | null>(null);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    role: "admin" as "admin" | "staff",
    password: "",
    image: null as File | null,
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || !formData.position || !formData.password) {
        errorToast("Please fill in all required fields");
        return;
      }
      
      const form = new FormData();
      
      // Handle text fields
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("position", formData.position);
      form.append("role", formData.role);
      form.append("password", formData.password);
      
      // Handle file upload
      if (formData.image) {
        form.append("image", formData.image);
      }
      
      if (action === "edit" && selectedUser) {
        form.append("_method", "PUT");
        form.append("id", selectedUser._id || "");
      }

      const response = await fetch("/api/users", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchUsers();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "User created successfully!" : "User updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save user");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", userToDelete);

      const response = await fetch("/api/users", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchUsers();
        successToast("User deleted successfully!");
        onDeleteModalOpenChange();
        setUserToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete user");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      role: "admin",
      password: "",
      image: null,
    });
    setSelectedUser(null);
  };

  // Open edit drawer
  const openEditDrawer = (user: UsersInterface) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      position: user.position,
      role: user.role || "admin",
      password: "",
      image: null, // Reset file input for edit
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (user: UsersInterface) => {
    setSelectedUser(user);
    setIsViewDrawerOpen(true);
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users and their roles</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <CustomInput
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            endContent={<Search className="text-gray-400 w-5 h-5" />}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <img 
                            src={typeof user.image === 'string' ? user.image : ''} 
                            alt={user.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-medium text-sm">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openViewDrawer(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditDrawer(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                                                    onClick={() => openDeleteModal(user._id || "")}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        )}
      </div>

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New User"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
          <CustomInput
            label="Full Name"
            type="text"
            isRequired={true}
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
            endContent={<User size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Email"
            type="email"
            isRequired={true}
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            endContent={<Mail size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Phone"
            type="tel"
            isRequired={true}
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
            endContent={<Phone size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Position"
            type="text"
            isRequired={true}
            name="position"
            placeholder="Enter job position"
            value={formData.position}
            onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
            endContent={<Briefcase size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Role"
            placeholder="Select user role"
            selectedKeys={[formData.role]}
            onSelectionChange={(keys) => {
              const selectedRole = Array.from(keys)[0] as "admin" | "staff";
              setFormData({ ...formData, role: selectedRole });
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

          <CustomInput
            label="Password"
            type="password"
            isRequired={true}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
            endContent={<Lock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, image: file });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload a new image file or leave empty to keep current image
            </p>
            {selectedUser?.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current image:</p>
                <img 
                  src={typeof selectedUser.image === 'string' ? selectedUser.image : ''} 
                  alt="Current profile" 
                  className="mt-1 h-16 w-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="flat"
              color="default"
              onPress={() => {
                resetForm();
                setIsCreateDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create User
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit User"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "edit")} className="space-y-6">
          <CustomInput
            label="Full Name"
            type="text"
            isRequired={true}
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
            endContent={<User size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Email"
            type="email"
            isRequired={true}
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            endContent={<Mail size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Phone"
            type="tel"
            isRequired={true}
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
            endContent={<Phone size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Position"
            type="text"
            isRequired={true}
            name="position"
            placeholder="Enter job position"
            value={formData.position}
            onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
            endContent={<Briefcase size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Role"
            placeholder="Select user role"
            selectedKeys={[formData.role]}
            onSelectionChange={(keys) => {
              const selectedRole = Array.from(keys)[0] as "admin" | "staff";
              setFormData({ ...formData, role: selectedRole });
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

          <CustomInput
            label="New Password (leave blank to keep current)"
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
            endContent={<Lock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, image: file });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload a new image file or leave empty to keep current image
            </p>
            {selectedUser?.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current image:</p>
                <img 
                  src={typeof selectedUser.image === 'string' ? selectedUser.image : ''} 
                  alt="Current profile" 
                  className="mt-1 h-16 w-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="flat"
              color="default"
              onPress={() => {
                resetForm();
                setIsEditDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update User
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                {selectedUser.image ? (
                  <img 
                    src={typeof selectedUser.image === 'string' ? selectedUser.image : ''} 
                    alt={selectedUser.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-xl">
                    {selectedUser.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedUser.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedUser.role === "admin" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                }`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        header="Delete User"
        content="Are you sure you want to delete this user? This action cannot be undone."
      >
        <div className="flex gap-3">
          <Button
            variant="flat"
            color="default"
            onPress={() => onDeleteModalOpenChange()}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
          >
            Delete
          </Button>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default Users; 