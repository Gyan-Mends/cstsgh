import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, GraduationCap, FileText, Calendar, MapPin, Users, Clock, Image } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { TrainingInterface, TrainingTypeInterface } from "~/components/interface";
import { Button, useDisclosure, Select, SelectItem } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Training Management - CSTS Admin" },
    { name: "description", content: "Manage training sessions in the CSTS system" },
  ];
};

const Training = () => {
  const [trainings, setTrainings] = useState<TrainingInterface[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingTypeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingInterface | null>(null);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [trainingToDelete, setTrainingToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    format: "",
    client: "",
    image: "" as string,
    trainingTypeId: "",
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

  // Fetch data
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/training");
      const data = await response.json();
      
      if (data.success) {
        setTrainings(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch trainings");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingTypes = async () => {
    try {
      const response = await fetch("/api/training-types");
      const data = await response.json();
      if (data.success) setTrainingTypes(data.data);
    } catch (err) {
      console.error("Failed to fetch training types");
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchTrainingTypes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.date) {
        errorToast("Please fill in all required fields");
        return;
      }
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        duration: formData.duration,
        format: formData.format,
        client: formData.client,
        image: formData.image,
        trainingTypeId: formData.trainingTypeId,
        ...(action === "edit" && selectedTraining && { id: selectedTraining._id }),
      };

      const response = await fetch("/api/training", {
        method: action === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainings();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Training created successfully!" : "Training updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save training");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setTrainingToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!trainingToDelete) return;
    
    try {
      const response = await fetch("/api/training", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: trainingToDelete }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainings();
        successToast("Training deleted successfully!");
        onDeleteModalOpenChange();
        setTrainingToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete training");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      duration: "",
      format: "",
      client: "",
      image: "",
      trainingTypeId: "",
    });
    setSelectedTraining(null);
  };

  // Open edit drawer
  const openEditDrawer = (training: TrainingInterface) => {
    setSelectedTraining(training);
    setFormData({
      title: training.title,
      description: training.description,
      date: training.date,
      duration: training.duration,
      format: training.format,
      client: training.client,
      image: training.image || "",
      trainingTypeId: training.trainingTypeId || "",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (training: TrainingInterface) => {
    setSelectedTraining(training);
    setIsViewDrawerOpen(true);
  };

  // Define table columns
  const columns: Column<TrainingInterface>[] = [
    {
      key: 'title',
      title: 'Training',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center overflow-hidden">
            {record.image ? (
              <img 
                src={record.image} 
                alt={record.title}
                className="h-10 w-10 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <GraduationCap 
              size={16} 
              className={`text-white ${record.image ? 'hidden' : ''}`} 
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {record.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      title: 'Date',
      render: (value) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'format',
      title: 'Format',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === "online" 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            : value === "in-person"
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
        }`}>
          {value || 'hybrid'}
        </span>
      ),
    },
    {
      key: 'client',
      title: 'Client',
      render: (value) => (
        <div className="text-sm text-gray-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (value) => (
        <div className="text-sm text-gray-900 dark:text-white">{value}</div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage training sessions and programs</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Training
        </button>
      </div>

      {/* DataTable */}
      <DataTable
        data={trainings}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search trainings by title, description, or client..."
        emptyText="No training sessions found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Training"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
          <CustomInput
            label="Training Title"
            type="text"
            isRequired={true}
            name="title"
            placeholder="Enter training title"
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Enter training description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <CustomInput
            label="Date"
            type="date"
            isRequired={true}
            name="date"
            value={formData.date}
            onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
            endContent={<Calendar size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Duration"
            type="text"
            name="duration"
            placeholder="e.g., 2 hours, 1 day"
            value={formData.duration}
            onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
            endContent={<Clock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Format"
            placeholder="Select training format"
            selectedKeys={formData.format ? [formData.format] : []}
            onSelectionChange={(keys) => {
              const selectedFormat = Array.from(keys)[0] as string;
              setFormData({ ...formData, format: selectedFormat || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            <SelectItem key="online">Online</SelectItem>
            <SelectItem key="in-person">In-Person</SelectItem>
            <SelectItem key="hybrid">Hybrid</SelectItem>
          </Select>

          <CustomInput
            label="Client"
            type="text"
            name="client"
            placeholder="Enter client name"
            value={formData.client}
            onChange={(e: any) => setFormData({ ...formData, client: e.target.value })}
            endContent={<Users size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Training Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload an image file for the training session
            </p>
            {formData.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Training preview" 
                  className="h-20 w-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <Select
            label="Training Type"
            placeholder="Select training type"
            selectedKeys={formData.trainingTypeId ? [formData.trainingTypeId] : []}
            onSelectionChange={(keys) => {
              const selectedType = Array.from(keys)[0] as string;
              setFormData({ ...formData, trainingTypeId: selectedType || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {trainingTypes.map((type) => (
              <SelectItem key={type._id || ""}>
                {type.name}
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
              Create Training
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
        title="Edit Training"
        size="md"
      >
        <form onSubmit={(e) => handleSubmit(e, "edit")} className="space-y-6">
          <CustomInput
            label="Training Title"
            type="text"
            isRequired={true}
            name="title"
            placeholder="Enter training title"
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Enter training description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <CustomInput
            label="Date"
            type="date"
            isRequired={true}
            name="date"
            value={formData.date}
            onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
            endContent={<Calendar size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Duration"
            type="text"
            name="duration"
            placeholder="e.g., 2 hours, 1 day"
            value={formData.duration}
            onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
            endContent={<Clock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <Select
            label="Format"
            placeholder="Select training format"
            selectedKeys={formData.format ? [formData.format] : []}
            onSelectionChange={(keys) => {
              const selectedFormat = Array.from(keys)[0] as string;
              setFormData({ ...formData, format: selectedFormat || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            <SelectItem key="online">Online</SelectItem>
            <SelectItem key="in-person">In-Person</SelectItem>
            <SelectItem key="hybrid">Hybrid</SelectItem>
          </Select>

          <CustomInput
            label="Client"
            type="text"
            name="client"
            placeholder="Enter client name"
            value={formData.client}
            onChange={(e: any) => setFormData({ ...formData, client: e.target.value })}
            endContent={<Users size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Training Image
            </label>
            {selectedTraining?.image && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current image:</p>
                <img 
                  src={selectedTraining.image} 
                  alt="Current training" 
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
              Choose a new image file or leave empty to keep current image
            </p>
            {formData.image && formData.image !== selectedTraining?.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New image preview:</p>
                <img 
                  src={formData.image} 
                  alt="New training preview" 
                  className="h-20 w-32 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <Select
            label="Training Type"
            placeholder="Select training type"
            selectedKeys={formData.trainingTypeId ? [formData.trainingTypeId] : []}
            onSelectionChange={(keys) => {
              const selectedType = Array.from(keys)[0] as string;
              setFormData({ ...formData, trainingTypeId: selectedType || "" });
            }}
            variant="bordered"
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {trainingTypes.map((type) => (
              <SelectItem key={type._id || ""}>
                {type.name}
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
              Update Training
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Training Details"
        size="md"
      >
        {selectedTraining && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center overflow-hidden">
                {selectedTraining.image ? (
                  <img 
                    src={selectedTraining.image} 
                    alt={selectedTraining.title}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <GraduationCap 
                  size={24} 
                  className={`text-white ${selectedTraining.image ? 'hidden' : ''}`} 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTraining.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Training Session</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTraining.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(selectedTraining.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTraining.duration}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedTraining.format === "online" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : selectedTraining.format === "in-person"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                }`}>
                  {selectedTraining.format || 'hybrid'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTraining.client}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        header="Delete Training"
        content="Are you sure you want to delete this training session? This action cannot be undone."
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

export default Training; 