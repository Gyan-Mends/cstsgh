import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, BookOpen, FileText, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Code, X, Youtube as YoutubeIcon } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { BlogInterface, CategoryInterface, UsersInterface } from "~/components/interface";
import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import YoutubeExtension from '@tiptap/extension-youtube';

// Custom Tiptap Editor Component
const TiptapEditor = ({ value, onChange, placeholder }: { 
  value: string; 
  onChange: (content: string) => void; 
  placeholder?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      YoutubeExtension.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Toolbar button style
  const toolbarButtonClass = (isActive: boolean) => `
    p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 
    ${isActive ? 'bg-gray-200 dark:bg-gray-600' : ''}
    text-gray-600 dark:text-gray-300
  `;

  // Divider component
  const Divider = () => (
    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
  );

  // Handle image insertion
  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  // Handle YouTube video insertion
  const addYoutubeVideo = () => {
    const url = window.prompt('Enter the URL of the YouTube video:');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center flex-wrap gap-1">
          {/* Text Style */}
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={toolbarButtonClass(editor?.isActive('bold') || false)}
            type="button"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={toolbarButtonClass(editor?.isActive('italic') || false)}
            type="button"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={toolbarButtonClass(editor?.isActive('strike') || false)}
            type="button"
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className={toolbarButtonClass(editor?.isActive('code') || false)}
            type="button"
            title="Inline Code"
          >
            <Code size={16} />
          </button>

          <Divider />

          {/* Headings */}
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={toolbarButtonClass(editor?.isActive('heading', { level: 1 }) || false)}
            type="button"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolbarButtonClass(editor?.isActive('heading', { level: 2 }) || false)}
            type="button"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={toolbarButtonClass(editor?.isActive('heading', { level: 3 }) || false)}
            type="button"
            title="Heading 3"
          >
            H3
          </button>

          <Divider />

          {/* Alignment */}
          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={toolbarButtonClass(editor?.isActive({ textAlign: 'left' }) || false)}
            type="button"
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={toolbarButtonClass(editor?.isActive({ textAlign: 'center' }) || false)}
            type="button"
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={toolbarButtonClass(editor?.isActive({ textAlign: 'right' }) || false)}
            type="button"
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>

          <Divider />

          {/* Lists */}
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={toolbarButtonClass(editor?.isActive('bulletList') || false)}
            type="button"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={toolbarButtonClass(editor?.isActive('orderedList') || false)}
            type="button"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <Divider />

          {/* Block Formats */}
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={toolbarButtonClass(editor?.isActive('blockquote') || false)}
            type="button"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={toolbarButtonClass(editor?.isActive('codeBlock') || false)}
            type="button"
            title="Code Block"
          >
            <Code size={16} />
          </button>

          <Divider />

          {/* Media */}
          <button
            onClick={addImage}
            className={toolbarButtonClass(false)}
            type="button"
            title="Insert Image"
          >
            <ImageIcon size={16} />
          </button>
          <button
            onClick={addYoutubeVideo}
            className={toolbarButtonClass(false)}
            type="button"
            title="Insert YouTube Video"
          >
            <YoutubeIcon size={16} />
          </button>

          <Divider />

          {/* Clear Formatting */}
          <button
            onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
            className={toolbarButtonClass(false)}
            type="button"
            title="Clear Formatting"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  );
};

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
    image: null as File | null,
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
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("admin", formData.admin);
      form.append("status", formData.status);
      
      // Handle file upload
      if (formData.image) {
        form.append("image", formData.image);
      }
      
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
      image: null,
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
      image: null, // Reset file input for edit
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
                src={typeof record.image === 'string' ? record.image : ''} 
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
              {record.description.length > 50 ? record.description.substring(0, 50) + '...' : record.description}
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
        size="lg"
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
            <TiptapEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Enter blog description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blog Image
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
              Upload an image file for the blog post
            </p>
          </div>

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
              <SelectItem key={category._id || ""}>
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
              <SelectItem key={user._id || ""}>
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
        size="lg"
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
            <TiptapEditor
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Enter blog description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blog Image
            </label>
            {selectedBlog?.image && typeof selectedBlog.image === 'string' && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
                <img 
                  src={selectedBlog.image} 
                  alt="Current blog" 
                  className="h-20 w-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
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
              Choose a new image file or leave empty to keep current image
            </p>
          </div>

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
              <SelectItem key={category._id || ""}>
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
              <SelectItem key={user._id || ""}>
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
        size="lg"
      >
        {selectedBlog && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {selectedBlog.image && typeof selectedBlog.image === 'string' ? (
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
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                  />
                </div>
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