import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon, FileText } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import type { GalleryInterface } from "~/components/interface";
import { successToast, errorToast } from "~/components/toast";

export const meta = () => {
  return [
    { title: "Gallery Management - CSTS Admin" },
    { name: "description", content: "Manage gallery items in the CSTS system" },
  ];
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryInterface | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    image: "",
  });

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, image: base64 });
      } catch (error) {
        errorToast("Failed to process image file");
      }
    }
  };

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery");
      const data = await response.json();
      
      if (data.success) {
        setGalleryItems(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.image) {
        errorToast("Please fill in all required fields");
        return;
      }

      const requestData = {
        title: formData.title,
        type: formData.type,
        image: formData.image,
        ...(action === "edit" && selectedItem && { id: selectedItem._id }),
      };

      const response = await fetch("/api/gallery", {
        method: action === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchGalleryItems();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Gallery item created successfully!" : "Gallery item updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save gallery item");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    
    try {
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchGalleryItems();
        successToast("Gallery item deleted successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete gallery item");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      image: "",
    });
    setSelectedItem(null);
  };

  // Open edit drawer
  const openEditDrawer = (item: GalleryInterface) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      image: item.image || "",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (item: GalleryInterface) => {
    setSelectedItem(item);
    setIsViewDrawerOpen(true);
  };

  // Filter items based on search
  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const GalleryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <CustomInput
        label="Title"
        type="text"
        isRequired={true}
        name="title"
        placeholder="Enter gallery item title"
        value={formData.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
        endContent={<FileText size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type *
        </label>
        <select
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select Type</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="certificate">Certificate</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image {!isEdit && "*"}
        </label>
        {isEdit && selectedItem?.image && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
            <img 
              src={selectedItem.image} 
              alt="Current gallery item" 
              className="h-20 w-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'h-20 w-32 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center';
                fallback.innerHTML = '<span class="text-gray-500 text-sm">Image not found</span>';
                target.parentNode?.insertBefore(fallback, target.nextSibling);
              }}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEdit ? "Choose a new image file or leave empty to keep current image" : "Upload an image file for the gallery item"}
        </p>
        {formData.image && formData.image !== selectedItem?.image && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New image preview:</p>
            <img 
              src={formData.image} 
              alt="New gallery item preview" 
              className="h-20 w-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          </div>
        )}
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
          {isEdit ? "Update Item" : "Create Item"}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage photos, videos and documents</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Item
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <CustomInput
            type="text"
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            endContent={<Search className="text-gray-400 w-5 h-5" />}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.type === "photo" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : item.type === "video"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    : item.type === "certificate"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                }`}>
                  {item.type}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openViewDrawer(item)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditDrawer(item)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No gallery items found</p>
        </div>
      )}

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Add New Gallery Item"
        size="md"
      >
        <GalleryForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Gallery Item"
        size="md"
      >
        <GalleryForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Gallery Item Details"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {selectedItem.image && (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedItem.title}
              </h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                selectedItem.type === "photo" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  : selectedItem.type === "video"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                  : selectedItem.type === "certificate"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              }`}>
                {selectedItem.type}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Gallery; 