import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, BookOpen, FileText, Image } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { BlogInterface, CategoryInterface, UsersInterface } from "~/components/interface";
import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Blogs Management - CSTS Admin" },
    { name: "description", content: "Manage blogs in the CSTS system" },
  ];
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogInterface | null>(null);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    admin: "",
    status: "draft" as "draft" | "review" | "published",
  });

  // Fetch data
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchBlogs();
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
      
      if (action === "edit" && selectedBlog) {
        form.append("_method", "PUT");
        form.append("id", selectedBlog._id);
      }

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBlogs();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Blog created successfully!" : "Blog updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save blog");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setBlogToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", blogToDelete);

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBlogs();
        successToast("Blog deleted successfully!");
        onDeleteModalOpenChange();
        setBlogToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete blog");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      category: "",
      admin: "",
      status: "draft",
    });
    setSelectedBlog(null);
  };

  // Open edit drawer
  const openEditDrawer = (blog: BlogInterface) => {
    setSelectedBlog(blog);
    setFormData({
      name: blog.name,
      description: blog.description,
      image: blog.image,
      category: typeof blog.category === 'string' ? blog.category : blog.category._id,
      admin: typeof blog.admin === 'string' ? blog.admin : blog.admin?._id || "",
      status: blog.status || "draft",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (blog: BlogInterface) => {
    setSelectedBlog(blog);
    setIsViewDrawerOpen(true);
  };

  // Define table columns
  const columns: Column<BlogInterface>[] = [
    {
      key: 'name',
      title: 'Blog',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {record.image ? (
              <img 
                src={record.image} 
                alt={record.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <BookOpen size={16} className="text-white" />
            )}
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
      key: 'category',
      title: 'Category',
      render: (value, record) => {
        const category = typeof record.category === 'object' && record.category ? record.category : null;
        return category ? (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            {category.name}
          </span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">No category</span>
        );
      },
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === "published" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : value === "review"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }`}>
          {value || 'draft'}
        </span>
      ),
    },
    {
      key: 'admin',
      title: 'Author',
      render: (value, record) => {
        const author = typeof record.admin === 'object' && record.admin ? record.admin : null;
        return author ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {author.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-900 dark:text-white">{author.fullName}</div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">No author</span>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage blog posts and articles</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Blog
        </button>
      </div>

      {/* DataTable */}
      <DataTable
        data={blogs}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search blogs by title or description..."
        emptyText="No blogs found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Blog"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
          <CustomInput
            label="Blog Title"
            type="text"
            isRequired={true}
            name="name"
            placeholder="Enter blog title"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            endContent={<FileText size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
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
              placeholder="Enter blog description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <CustomInput
            label="Image URL"
            type="url"
            name="image"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={(e: any) => setFormData({ ...formData, image: e.target.value })}
            endContent={<Image size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const selectedCategory = Array.from(keys)[0] as string;
              setFormData({ ...formData, category: selectedCategory || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category._id || ""} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Author"
            placeholder="Select an author"
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

          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={[formData.status]}
            onSelectionChange={(keys) => {
              const selectedStatus = Array.from(keys)[0] as "draft" | "review" | "published";
              setFormData({ ...formData, status: selectedStatus });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="review">Under Review</SelectItem>
            <SelectItem key="published">Published</SelectItem>
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
              Create Blog
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
        title="Edit Blog"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "edit")} className="space-y-6">
          <CustomInput
            label="Blog Title"
            type="text"
            isRequired={true}
            name="name"
            placeholder="Enter blog title"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            endContent={<FileText size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
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
              placeholder="Enter blog description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <CustomInput
            label="Image URL"
            type="url"
            name="image"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={(e: any) => setFormData({ ...formData, image: e.target.value })}
            endContent={<Image size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const selectedCategory = Array.from(keys)[0] as string;
              setFormData({ ...formData, category: selectedCategory || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category._id || ""} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Author"
            placeholder="Select an author"
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

          <Select
            label="Status"
            placeholder="Select status"
            selectedKeys={[formData.status]}
            onSelectionChange={(keys) => {
              const selectedStatus = Array.from(keys)[0] as "draft" | "review" | "published";
              setFormData({ ...formData, status: selectedStatus });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="review">Under Review</SelectItem>
            <SelectItem key="published">Published</SelectItem>
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
              Update Blog
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Blog Details"
        size="md"
      >
        {selectedBlog && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {selectedBlog.image ? (
                  <img 
                    src={selectedBlog.image} 
                    alt={selectedBlog.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <BookOpen size={24} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedBlog.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Blog Post</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedBlog.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                {typeof selectedBlog.category === 'object' && selectedBlog.category ? (
                  <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    {selectedBlog.category.name}
                  </span>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No category assigned</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                {typeof selectedBlog.admin === 'object' && selectedBlog.admin ? (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {selectedBlog.admin.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedBlog.admin.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedBlog.admin.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No author assigned</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedBlog.status === "published" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : selectedBlog.status === "review"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                }`}>
                  {selectedBlog.status || 'draft'}
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
        header="Delete Blog"
        content="Are you sure you want to delete this blog? This action cannot be undone."
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

export default Blogs; 