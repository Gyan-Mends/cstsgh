import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, Tag, User } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { CategoryInterface, UsersInterface } from "~/components/interface";
import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Categories Management - CSTS Admin" },
    { name: "description", content: "Manage categories in the CSTS system" },
  ];
};

const Categories = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    admin: "",
  });

  // Fetch categories and users
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description) {
        errorToast("Please fill in all required fields");
        return;
      }
      
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      
      if (action === "edit" && selectedCategory) {
        form.append("_method", "PUT");
        form.append("id", selectedCategory._id);
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCategories();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Category created successfully!" : "Category updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save category");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setCategoryToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", categoryToDelete);

      const response = await fetch("/api/categories", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCategories();
        successToast("Category deleted successfully!");
        onDeleteModalOpenChange();
        setCategoryToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete category");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      admin: "",
    });
    setSelectedCategory(null);
  };

  // Open edit drawer
  const openEditDrawer = (category: CategoryInterface) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      admin: typeof category.admin === 'string' ? category.admin : category.admin?._id || "",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (category: CategoryInterface) => {
    setSelectedCategory(category);
    setIsViewDrawerOpen(true);
  };

  // Define table columns
  const columns: Column<CategoryInterface>[] = [
    {
      key: 'name',
      title: 'Category',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
            <Tag size={16} className="text-white" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {record.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'admin',
      title: 'Admin',
      render: (value, record) => {
        const adminUser = typeof record.admin === 'object' && record.admin ? record.admin : null;
        return adminUser ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {adminUser.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-900 dark:text-white">{adminUser.fullName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{adminUser.email}</div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">No admin assigned</span>
        );
      },
    },
    {
      key: '_id',
      title: 'Actions',
      sortable: false,
      searchable: false,
      align: 'right' as const,
      render: (value, record) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewDrawer(record);
            }}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditDrawer(record);
            }}
            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(record._id || "");
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage content categories</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Category
        </button>
      </div>

      {/* DataTable */}
      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search categories by name or description..."
        emptyText="No categories found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Category"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
          <CustomInput
            label="Category Name"
            type="text"
            isRequired={true}
            name="name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            endContent={<Tag size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <Select
            label="Admin (Optional)"
            placeholder="Select an admin user"
            selectedKeys={formData.admin ? [formData.admin] : []}
            onSelectionChange={(keys) => {
              const selectedAdmin = Array.from(keys)[0] as string;
              setFormData({ ...formData, admin: selectedAdmin || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {users.map((user) => (
              <SelectItem key={user._id || ""} value={user._id}>
                {user.fullName}
              </SelectItem>
            ))}
          </Select>

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
              Create Category
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
        title="Edit Category"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "edit")} className="space-y-6">
          <CustomInput
            label="Category Name"
            type="text"
            isRequired={true}
            name="name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            endContent={<Tag size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <Select
            label="Admin (Optional)"
            placeholder="Select an admin user"
            selectedKeys={formData.admin ? [formData.admin] : []}
            onSelectionChange={(keys) => {
              const selectedAdmin = Array.from(keys)[0] as string;
              setFormData({ ...formData, admin: selectedAdmin || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {users.map((user) => (
              <SelectItem key={user._id || ""} value={user._id}>
                {user.fullName}
              </SelectItem>
            ))}
          </Select>

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
              Update Category
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Category Details"
        size="md"
      >
        {selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center">
                <Tag size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCategory.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Category</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCategory.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</label>
                {typeof selectedCategory.admin === 'object' && selectedCategory.admin ? (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {selectedCategory.admin.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCategory.admin.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCategory.admin.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No admin assigned</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        header="Delete Category"
        content="Are you sure you want to delete this category? This action cannot be undone."
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

export default Categories;