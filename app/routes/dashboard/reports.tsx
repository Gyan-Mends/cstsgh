import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, FileText, Calendar, Building, Tag, Download } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { ReportInterface, ReportCategory } from "~/components/interface";
import { Button, useDisclosure, Select, SelectItem, Chip } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Reports Management - CSTS Admin" },
    { name: "description", content: "Manage reports and documents in the CSTS system" },
  ];
};

const Reports = () => {
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportInterface | null>(null);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ReportCategory | "",
    eventDate: "",
    eventLocation: "",
    eventOrganizer: "",
    summary: "",
    isPublished: false,
    tags: "",
    keyOutcomes: "",
    file: null as File | null,
  });

  // Categories for dropdown
  const categories: ReportCategory[] = [
    'Trade Forums',
    'Legal Conferences',
    'Technology Conferences',
    'Government Meetings',
    'Business Roundtables',
    'Academic Conferences'
  ];

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
      setFormData({ ...formData, file });
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports");
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, action: "create" | "edit") => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.eventDate) {
        errorToast("Please fill in all required fields");
        return;
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        eventOrganizer: formData.eventOrganizer,
        summary: formData.summary,
        isPublished: formData.isPublished,
        tags: formData.tags,
        keyOutcomes: formData.keyOutcomes,
        ...(formData.file && { file: await convertToBase64(formData.file), filename: formData.file.name, fileSize: formData.file.size }),
        ...(action === "edit" && selectedReport && { id: selectedReport._id }),
      };

      const response = await fetch("/api/reports", {
        method: action === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReports();
        resetForm();
        setIsCreateDrawerOpen(false);
        setIsEditDrawerOpen(false);
        successToast(action === "create" ? "Report created successfully!" : "Report updated successfully!");
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to save report");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setReportToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      const response = await fetch("/api/reports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: reportToDelete }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReports();
        successToast("Report deleted successfully!");
        onDeleteModalOpenChange();
        setReportToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete report");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      eventDate: "",
      eventLocation: "",
      eventOrganizer: "",
      summary: "",
      isPublished: false,
      tags: "",
      keyOutcomes: "",
      file: null,
    });
    setSelectedReport(null);
  };

  // Open edit drawer
  const openEditDrawer = (report: ReportInterface) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      eventDate: report.eventDate ? new Date(report.eventDate).toISOString().split('T')[0] : "",
      eventLocation: report.eventLocation || "",
      eventOrganizer: report.eventOrganizer || "",
      summary: report.summary || "",
      isPublished: report.isPublished,
      tags: report.tags?.join(', ') || "",
      keyOutcomes: report.keyOutcomes?.join(', ') || "",
      file: null, // Keep empty for edit
    });
    setIsEditDrawerOpen(true);
  };

  // Open view drawer
  const openViewDrawer = (report: ReportInterface) => {
    setSelectedReport(report);
    setIsViewDrawerOpen(true);
  };

  // Handle file download
  const handleDownload = (report: ReportInterface) => {
    if (report.fileUrl) {
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = report.filename || 'report-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Define table columns
  const columns: Column<ReportInterface>[] = [
    {
      key: 'title',
      title: 'Report',
      render: (value, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {record.title}
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
      render: (value) => (
        <Chip 
          size="sm" 
          variant="flat"
          color="primary"
          className="text-xs"
        >
          {value}
        </Chip>
      ),
    },
    {
      key: 'eventDate',
      title: 'Event Date',
      render: (value) => (
        <div className="flex items-center text-sm text-gray-900 dark:text-white">
          <Calendar size={14} className="mr-2 text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'isPublished',
      title: 'Status',
      render: (value) => (
        <Chip 
          size="sm" 
          variant="flat"
          color={value ? "success" : "warning"}
          className="text-xs"
        >
          {value ? "Published" : "Draft"}
        </Chip>
      ),
    },
    {
      key: 'filename',
      title: 'File',
      render: (value, record) => (
        <div className="flex items-center">
          {value ? (
            <button
              onClick={() => handleDownload(record)}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Download size={14} className="mr-1" />
              <span className="text-xs truncate max-w-20">{value}</span>
            </button>
          ) : (
            <span className="text-xs text-gray-400">No file</span>
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
              openDeleteModal(record._id);
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage conference reports and documents</p>
        </div>
        <button
          onClick={() => setIsCreateDrawerOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Report
        </button>
      </div>

      {/* DataTable */}
      <DataTable
        data={reports}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search reports by title, description, or summary..."
        emptyText="No reports found"
        pageSize={10}
      />

      {/* Create Drawer */}
      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          resetForm();
        }}
        title="Add New Report"
        size="lg"
      >
        <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
          <CustomInput
            label="Report Title"
            type="text"
            isRequired={true}
            name="title"
            placeholder="Enter report title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Enter report description..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const selectedCategory = Array.from(keys)[0] as ReportCategory;
              setFormData({ ...formData, category: selectedCategory || "" });
            }}
            variant="bordered"
            isRequired
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category}>
                {category}
              </SelectItem>
            ))}
          </Select>

          <CustomInput
            label="Event Date"
            type="date"
            isRequired={true}
            name="eventDate"
            value={formData.eventDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventDate: e.target.value })}
            endContent={<Calendar size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Event Location"
            type="text"
            name="eventLocation"
            placeholder="Enter event location"
            value={formData.eventLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventLocation: e.target.value })}
            endContent={<Building size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Event Organizer"
            type="text"
            name="eventOrganizer"
            placeholder="Enter event organizer"
            value={formData.eventOrganizer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventOrganizer: e.target.value })}
            endContent={<Building size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Enter report summary..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <CustomInput
            label="Tags (comma-separated)"
            type="text"
            name="tags"
            placeholder="e.g., finance, legal, technology"
            value={formData.tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
            endContent={<Tag size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Outcomes (comma-separated)
            </label>
            <textarea
              rows={3}
              value={formData.keyOutcomes}
              onChange={(e) => setFormData({ ...formData, keyOutcomes: e.target.value })}
              placeholder="Enter key outcomes separated by commas..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload a report file (PDF, DOC, DOCX, TXT, JPG, PNG)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Publish report (make it visible to public)
            </label>
          </div>

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
              Create Report
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
        title="Edit Report"
        size="lg"
      >
        <form onSubmit={(e) => handleSubmit(e, "edit")} className="space-y-6">
          <CustomInput
            label="Report Title"
            type="text"
            isRequired={true}
            name="title"
            placeholder="Enter report title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Enter report description..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const selectedCategory = Array.from(keys)[0] as ReportCategory;
              setFormData({ ...formData, category: selectedCategory || "" });
            }}
            variant="bordered"
            isRequired
            classNames={{
              label: "font-nunito text-sm !text-white",
              trigger: "border border-white/20 bg-dashboard-secondary hover:bg-dashboard-secondary hover:border-white/20 focus-within:border-white/20",
              value: "text-gray-400"
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category}>
                {category}
              </SelectItem>
            ))}
          </Select>

          <CustomInput
            label="Event Date"
            type="date"
            isRequired={true}
            name="eventDate"
            value={formData.eventDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventDate: e.target.value })}
            endContent={<Calendar size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Event Location"
            type="text"
            name="eventLocation"
            placeholder="Enter event location"
            value={formData.eventLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventLocation: e.target.value })}
            endContent={<Building size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <CustomInput
            label="Event Organizer"
            type="text"
            name="eventOrganizer"
            placeholder="Enter event organizer"
            value={formData.eventOrganizer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eventOrganizer: e.target.value })}
            endContent={<Building size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Enter report summary..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <CustomInput
            label="Tags (comma-separated)"
            type="text"
            name="tags"
            placeholder="e.g., finance, legal, technology"
            value={formData.tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
            endContent={<Tag size={18} className="text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Outcomes (comma-separated)
            </label>
            <textarea
              rows={3}
              value={formData.keyOutcomes}
              onChange={(e) => setFormData({ ...formData, keyOutcomes: e.target.value })}
              placeholder="Enter key outcomes separated by commas..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report File
            </label>
            {selectedReport?.filename && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current file:</p>
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{selectedReport.filename}</span>
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedReport)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a new file or leave empty to keep current file
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublishedEdit"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublishedEdit" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Publish report (make it visible to public)
            </label>
          </div>

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
              Update Report
            </Button>
          </div>
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Report Details"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedReport.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Chip size="sm" variant="flat" color="primary">
                    {selectedReport.category}
                  </Chip>
                  <Chip size="sm" variant="flat" color={selectedReport.isPublished ? "success" : "warning"}>
                    {selectedReport.isPublished ? "Published" : "Draft"}
                  </Chip>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Date</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedReport.eventDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedReport.eventLocation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedReport.eventLocation}</p>
                  </div>
                )}
              </div>

              {selectedReport.eventOrganizer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organizer</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedReport.eventOrganizer}</p>
                </div>
              )}

              {selectedReport.summary && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedReport.summary}</p>
                  </div>
                </div>
              )}

              {selectedReport.tags && selectedReport.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedReport.tags.map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.keyOutcomes && selectedReport.keyOutcomes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Outcomes</label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      {selectedReport.keyOutcomes.map((outcome, index) => (
                        <li key={index} className="text-sm text-gray-900 dark:text-white">{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedReport.filename && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attached File</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{selectedReport.filename}</span>
                    <button
                      onClick={() => handleDownload(selectedReport)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        header="Delete Report"
        content="Are you sure you want to delete this report? This action cannot be undone."
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

export default Reports;