import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, Users, User, Mail, Phone, Briefcase, Award } from "lucide-react";
import Drawer from "~/components/Drawer";
import DataTable, { type Column } from "~/components/DataTable";
import CustomInput from "~/components/CustomInput";
import type { DirectorsBankInterface } from "~/components/interface";
import { successToast, errorToast } from "~/components/toast";

export const meta = () => {
  return [
    { title: "Directors Bank - CSTS Admin" },
    { name: "description", content: "Manage directors in the CSTS system" },
  ];
};

const DirectorsBank = () => {
  const [directors, setDirectors] = useState<DirectorsBankInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<DirectorsBankInterface | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image: "",
    areasOfExpertise: [] as string[],
    email: "",
    phone: "",
  });

  const [newExpertiseArea, setNewExpertiseArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Fetch directors
  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/directors-bank");
      const data = await response.json();
      
      if (data.success) {
        setDirectors(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch directors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.position || !formData.bio || !formData.email || !formData.phone) {
        errorToast("Please fill in all required fields");
        return;
      }

      const requestData = {
        name: formData.name,
        position: formData.position,
        bio: formData.bio,
        image: formData.image,
        areasOfExpertise: formData.areasOfExpertise,
        email: formData.email,
        phone: formData.phone,
        ...(action === "edit" && selectedDirector && { id: selectedDirector._id }),
      };

      const response = await fetch("/api/directors-bank", {
        method: action === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchDirectors();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Director created successfully!" : "Director updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save director");
    }
  };

  // Handle delete
  const handleDelete = async (director: DirectorsBankInterface) => {
    if (!confirm("Are you sure you want to delete this director?")) return;
    
    try {
      const response = await fetch("/api/directors-bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: director._id }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchDirectors();
        successToast("Director deleted successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete director");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      bio: "",
      image: "",
      areasOfExpertise: [],
      email: "",
      phone: "",
    });
    setNewExpertiseArea("");
    setSelectedDirector(null);
  };

  // Open edit drawer
  const openEditDrawer = (director: DirectorsBankInterface) => {
    setSelectedDirector(director);
    setFormData({
      name: director.name,
      position: director.position,
      bio: director.bio || "",
      image: director.image || "",
      areasOfExpertise: director.areasOfExpertise || [],
      email: director.email || "",
      phone: director.phone || "",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (director: DirectorsBankInterface) => {
    setSelectedDirector(director);
    setIsViewDrawerOpen(true);
  };

  // Add expertise area
  const addExpertiseArea = () => {
    if (newExpertiseArea.trim() && !formData.areasOfExpertise.includes(newExpertiseArea.trim())) {
      setFormData({
        ...formData,
        areasOfExpertise: [...formData.areasOfExpertise, newExpertiseArea.trim()]
      });
      setNewExpertiseArea("");
    }
  };

  // Remove expertise area
  const removeExpertiseArea = (area: string) => {
    setFormData({
      ...formData,
      areasOfExpertise: formData.areasOfExpertise.filter(item => item !== area)
    });
  };

  // Table columns
  const columns: Column<DirectorsBankInterface>[] = [
    {
      key: "image",
      title: "Photo",
      render: (value, director) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
            {director.image ? (
              <img 
                src={director.image} 
                alt={director.name}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-white font-medium text-sm ${director.image ? 'hidden' : ''}`}>
              {director.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: "position",
      title: "Position",
      render: (value) => (
        <div className="text-gray-600 dark:text-gray-400">{value}</div>
      ),
    },
    {
      key: "areasOfExpertise",
      title: "Expertise Areas",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((area: string, index: number) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
            >
              {area}
            </span>
          ))}
          {value?.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{value.length - 2} more
            </span>
          )}
        </div>
      ),
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
              handleDelete(record);
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const DirectorForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <CustomInput
        label="Director Name"
        type="text"
        isRequired={true}
        name="name"
        placeholder="Enter director name"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
        endContent={<User size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <CustomInput
        label="Position"
        type="text"
        isRequired={true}
        name="position"
        placeholder="Enter position"
        value={formData.position}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, position: e.target.value })}
        endContent={<Briefcase size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <CustomInput
        label="Email"
        type="email"
        isRequired={true}
        name="email"
        placeholder="Enter email address"
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
        endContent={<Mail size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <CustomInput
        label="Phone"
        type="tel"
        isRequired={true}
        name="phone"
        placeholder="Enter phone number"
        value={formData.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
        endContent={<Phone size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Biography *
        </label>
        <textarea
          required
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Enter director biography"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Director Image
        </label>
        {isEdit && selectedDirector?.image && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
            <img 
              src={selectedDirector.image} 
              alt="Current director" 
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'h-20 w-20 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center';
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
          {isEdit ? "Choose a new image file or leave empty to keep current image" : "Upload a profile image for the director"}
        </p>
        {formData.image && formData.image !== selectedDirector?.image && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New image preview:</p>
            <img 
              src={formData.image} 
              alt="New director preview" 
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Areas of Expertise (comma-separated) *
        </label>
        <textarea
          required
          rows={3}
          value={formData.areasOfExpertise.join(", ")}
          onChange={(e) => setFormData({ 
            ...formData, 
            areasOfExpertise: e.target.value.split(",").map(area => area.trim()).filter(area => area.length > 0)
          })}
          placeholder="e.g., Leadership, Strategy, Finance"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
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
          {isEdit ? "Update Director" : "Create Director"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Directors Bank</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage company directors and leadership</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Director
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <CustomInput
            type="text"
            placeholder="Search directors..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            endContent={<Search className="text-gray-400 w-5 h-5" />}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={directors}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search directors..."
        emptyText="No directors found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Add New Director"
        size="lg"
      >
        <DirectorForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Director"
        size="lg"
      >
        <DirectorForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Director Details"
        size="lg"
      >
        {selectedDirector && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {selectedDirector.image ? (
                  <img 
                    src={selectedDirector.image} 
                    alt={selectedDirector.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${selectedDirector.image ? 'hidden' : ''}`}>
                  <Users size={24} className="text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDirector.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedDirector.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{(selectedDirector as any).email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{(selectedDirector as any).phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biography</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {(selectedDirector as any).bio}
                </p>
              </div>
              
              {selectedDirector.areasOfExpertise && selectedDirector.areasOfExpertise.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Areas of Expertise
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDirector.areasOfExpertise.map((area: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DirectorsBank; 