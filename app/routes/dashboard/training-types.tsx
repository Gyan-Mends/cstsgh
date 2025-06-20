import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, GraduationCap, FileText, Image } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { TrainingTypeInterface } from "~/components/interface";

export const meta = () => {
  return [
    { title: "Training Types - CSTS Admin" },
    { name: "description", content: "Manage training types in the CSTS system" },
  ];
};

const TrainingTypes = () => {
  const [trainingTypes, setTrainingTypes] = useState<TrainingTypeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TrainingTypeInterface | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    isActive: true,
  });

  // Fetch training types
  const fetchTrainingTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/training-types");
      const data = await response.json();
      
      if (data.success) {
        setTrainingTypes(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch training types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description) {
        setError("Please fill in all required fields");
        return;
      }

      // For create action, image is required
      if (action === "create" && !formData.image) {
        setError("Please select an image file");
        return;
      }

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("isActive", formData.isActive.toString());
      
      // Handle file upload
      if (formData.image) {
        form.append("image", formData.image);
      }
      
      if (action === "edit" && selectedType) {
        form.append("_method", "PUT");
        form.append("id", selectedType._id);
      }

      const response = await fetch("/api/training-types", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainingTypes();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save training type");
    }
  };

  // Handle delete
  const handleDelete = async (type: TrainingTypeInterface) => {
    if (!confirm("Are you sure you want to delete this training type?")) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", type._id);

      const response = await fetch("/api/training-types", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainingTypes();
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete training type");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      isActive: true,
    });
    setSelectedType(null);
  };

  // Open edit drawer
  const openEditDrawer = (type: TrainingTypeInterface) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || "",
      image: null, // Reset file input for edit
      isActive: type.isActive,
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (type: TrainingTypeInterface) => {
    setSelectedType(type);
    setIsViewDrawerOpen(true);
  };

  // Define table columns
  const columns: Column<TrainingTypeInterface>[] = [
    {
      key: "name",
      title: "Training Type",
      sortable: true,
      render: (value: string, record: TrainingTypeInterface) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center overflow-hidden">
            {record.image && typeof record.image === 'string' ? (
              <img 
                src={record.image} 
                alt={record.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <GraduationCap size={16} className="text-white" />
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
      key: "isActive",
      title: "Status",
      sortable: true,
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      sortable: true,
      render: (value: string) => (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          {new Date(value).toLocaleDateString()}
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

  const TrainingTypeForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <CustomInput
        label="Training Type Name"
        type="text"
        isRequired={true}
        name="name"
        placeholder="Enter training type name"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
        endContent={<GraduationCap size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
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
          placeholder="Enter training type description"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Training Type Image {!isEdit && "*"}
        </label>
        {isEdit && selectedType?.image && typeof selectedType.image === 'string' && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
            <img 
              src={selectedType.image} 
              alt="Current training type" 
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
          {isEdit ? "Choose a new image file or leave empty to keep current image" : "Upload an image file for the training type"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          value={formData.isActive ? "active" : "inactive"}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
          {isEdit ? "Update Type" : "Create Type"}
        </button>
      </div>
    </form>
  );

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Types</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage different types of training programs</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Training Type
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={trainingTypes}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search training types..."
        emptyText="No training types found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create Training Type"
        size="md"
      >
        <TrainingTypeForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Training Type"
        size="md"
      >
        <TrainingTypeForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Training Type Details"
        size="md"
      >
        {selectedType && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center overflow-hidden">
                {selectedType.image && typeof selectedType.image === 'string' ? (
                  <img 
                    src={selectedType.image} 
                    alt={selectedType.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <GraduationCap size={24} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedType.name}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedType.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {selectedType.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedType.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedType.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedType.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              {selectedType.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedType.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TrainingTypes; 