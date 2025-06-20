import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, BookOpen, FileText, Image } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import type { BlogInterface, CategoryInterface, UsersInterface } from "~/components/interface";

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
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogInterface | null>(null);
  
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
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch blogs");
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
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save blog");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", id);

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBlogs();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete blog");
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

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BlogForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <CustomInput
        label="Blog Title"
        type="text"
        isRequired={true}
        name="name"
        placeholder="Enter blog title"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
        endContent={<FileText size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <CustomInput
        label="Image URL"
        type="url"
        isRequired={true}
        name="image"
        placeholder="Enter image URL"
        value={formData.image}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
        endContent={<Image size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Author
        </label>
        <select
          value={formData.admin}
          onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select Author (Optional)</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "review" | "published" })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="review">Under Review</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsCreateDrawerOpen(false);
            setIsEditDrawerOpen(false);
          }}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {isEdit ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
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
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <CustomInput
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            endContent={<Search className="text-gray-400 w-5 h-5" />}
          />
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700">
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    blog.status === "published" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : blog.status === "review"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }`}>
                    {blog.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openViewDrawer(blog)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditDrawer(blog)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {blog.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                {blog.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {typeof blog.category === 'object' && blog.category && (
                  <span>Category: {blog.category.name}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No blogs found</p>
        </div>
      )}

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Blog"
        size="lg"
      >
        <BlogForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Blog"
        size="lg"
      >
        <BlogForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Blog Details"
        size="lg"
      >
        {selectedBlog && (
          <div className="space-y-6">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedBlog.name}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedBlog.status === "published" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : selectedBlog.status === "review"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                }`}>
                  {selectedBlog.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedBlog.description}</p>
              </div>
              {selectedBlog.category && typeof selectedBlog.category === 'object' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedBlog.category.name}</p>
                </div>
              )}
              {selectedBlog.admin && typeof selectedBlog.admin === 'object' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedBlog.admin.fullName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Blogs; 