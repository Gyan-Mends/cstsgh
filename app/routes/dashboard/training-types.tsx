import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, GraduationCap, FileText } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable from "~/components/DataTable";
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
    active: true,
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
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });
      
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
      active: true,
    });
    setSelectedType(null);
  };

  // Open edit drawer
  const openEditDrawer = (type: TrainingTypeInterface) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      active: type.active,
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (type: TrainingTypeInterface) => {
    setSelectedType(type);
    setIsViewDrawerOpen(true);
  };

  // Table columns
  const columns = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: "active",
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
  ];

  // Table actions
  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: openViewDrawer,
      color: "blue" as const,
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: openEditDrawer,
      color: "indigo" as const,
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: handleDelete,
      color: "red" as const,
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          value={formData.active ? "active" : "inactive"}
          onChange={(e) => setFormData({ ...formData, active: e.target.value === "active" })}
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
        actions={actions}
        loading={loading}
        searchPlaceholder="Search training types..."
        emptyMessage="No training types found"
        emptyIcon={GraduationCap}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create Training Type"
        size="sm"
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
        size="sm"
      >
        <TrainingTypeForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Training Type Details"
        size="sm"
      >
        {selectedType && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <GraduationCap size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedType.name}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedType.active 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {selectedType.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedType.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedType.active ? "Active" : "Inactive"}
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