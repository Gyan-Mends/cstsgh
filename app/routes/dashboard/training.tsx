import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Eye, GraduationCap, FileText, Calendar, MapPin, Users, Clock, Image } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import type { TrainingInterface, TrainingTypeInterface } from "~/components/interface";

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
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingInterface | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    format: "",
    client: "",
    image: "",
    trainingTypeId: "",
  });

  // Fetch data
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/training");
      const data = await response.json();
      
      if (data.success) {
        setTrainings(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch trainings");
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
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      
      if (action === "edit" && selectedTraining) {
        form.append("_method", "PUT");
        form.append("id", selectedTraining._id);
      }

      const response = await fetch("/api/training", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainings();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save training");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", id);

      const response = await fetch("/api/training", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTrainings();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete training");
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
      image: training.image,
      trainingTypeId: training.trainingTypeId || "",
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (training: TrainingInterface) => {
    setSelectedTraining(training);
    setIsViewDrawerOpen(true);
  };

  // Filter trainings based on search
  const filteredTrainings = trainings.filter(training =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TrainingForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <CustomInput
        label="Training Title"
        type="text"
        isRequired={true}
        name="title"
        placeholder="Enter training title"
        value={formData.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Date"
          type="date"
          isRequired={true}
          name="date"
          value={formData.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
          endContent={<Calendar size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
        />

        <CustomInput
          label="Duration"
          type="text"
          isRequired={true}
          name="duration"
          placeholder="e.g., 2 hours, 3 days"
          value={formData.duration}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration: e.target.value })}
          endContent={<Clock size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Format"
          type="text"
          isRequired={true}
          name="format"
          placeholder="e.g., Online, In-person, Hybrid"
          value={formData.format}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, format: e.target.value })}
          endContent={<Users size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
        />

        <CustomInput
          label="Client"
          type="text"
          isRequired={true}
          name="client"
          placeholder="Enter client name"
          value={formData.client}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, client: e.target.value })}
          endContent={<Users size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
        />
      </div>

      <CustomInput
        label="Image URL"
        type="url"
        name="image"
        placeholder="Enter image URL"
        value={formData.image}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
        endContent={<Image size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Training Type
        </label>
        <select
          value={formData.trainingTypeId}
          onChange={(e) => setFormData({ ...formData, trainingTypeId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select Training Type</option>
          {trainingTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
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
          {isEdit ? "Update Training" : "Create Training"}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage training programs and sessions</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Training
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <CustomInput
            type="text"
            placeholder="Search training..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            endContent={<Search className="text-gray-400 w-5 h-5" />}
          />
        </div>
      </div>

      {/* Training Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <div key={training._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700">
              {training.image && (
                <img
                  src={training.image}
                  alt={training.title}
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
                    training.format === "online" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      : training.format === "offline"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                  }`}>
                    {training.format}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openViewDrawer(training)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditDrawer(training)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(training._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {training.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                {training.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div>Date: {new Date(training.date).toLocaleDateString()}</div>
                <div>Duration: {training.duration}</div>
                <div>Client: {training.client}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No trainings found</p>
        </div>
      )}

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Training"
        size="lg"
      >
        <TrainingForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Training"
        size="lg"
      >
        <TrainingForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Training Details"
        size="lg"
      >
        {selectedTraining && (
          <div className="space-y-6">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {selectedTraining.image && (
                <img
                  src={selectedTraining.image}
                  alt={selectedTraining.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedTraining.title}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedTraining.format === "online" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : selectedTraining.format === "offline"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                }`}>
                  {selectedTraining.format}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTraining.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTraining.client}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Training; 