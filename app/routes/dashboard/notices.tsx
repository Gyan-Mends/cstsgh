import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import Drawer from "~/components/Drawer";
import DataTable from "~/components/DataTable";
import type { ComplianceNoticeInterface } from "~/components/interface";

export const meta = () => {
  return [
    { title: "Notices Management - CSTS Admin" },
    { name: "description", content: "Manage compliance notices in the CSTS system" },
  ];
};

const Notices = () => {
  const [notices, setNotices] = useState<ComplianceNoticeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<ComplianceNoticeInterface | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notices");
      const data = await response.json();
      
      if (data.success) {
        setNotices(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      
      if (action === "edit" && selectedNotice) {
        form.append("_method", "PUT");
        form.append("id", selectedNotice._id);
      }

      const response = await fetch("/api/notices", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchNotices();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save notice");
    }
  };

  // Handle delete
  const handleDelete = async (notice: ComplianceNoticeInterface) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    
    try {
      const form = new FormData();
      form.append("_method", "DELETE");
      form.append("id", notice._id);

      const response = await fetch("/api/notices", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchNotices();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete notice");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    });
    setSelectedNotice(null);
  };

  // Open edit drawer
  const openEditDrawer = (notice: ComplianceNoticeInterface) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (notice: ComplianceNoticeInterface) => {
    setSelectedNotice(notice);
    setIsViewDrawerOpen(true);
  };

  // Table columns
  const columns = [
    {
      key: "title",
      title: "Title",
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (value: string) => (
        <div className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
          {value}
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

  const NoticeForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit ? "edit" : "create")} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notice Title
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          required
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          {isEdit ? "Update Notice" : "Create Notice"}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Notices</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage compliance notices and announcements</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Notice
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={notices}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="Search notices..."
        emptyMessage="No notices found"
        emptyIcon={FileText}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Create New Notice"
        size="md"
      >
        <NoticeForm />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          resetForm();
        }}
        title="Edit Notice"
        size="md"
      >
        <NoticeForm isEdit />
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Notice Details"
        size="md"
      >
        {selectedNotice && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedNotice.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Compliance Notice</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedNotice.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Notices; 