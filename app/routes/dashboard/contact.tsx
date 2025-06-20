import { useState, useEffect } from "react";
import { Eye, Trash2, Phone, Mail, User, Calendar, MessageSquare } from "lucide-react";
import Drawer from "~/components/Drawer";
import CustomInput from "~/components/CustomInput";
import DataTable, { type Column } from "~/components/DataTable";
import type { ContactInterface } from "~/components/interface";
import { Button, useDisclosure } from "@heroui/react";
import { successToast, errorToast } from "~/components/toast";
import ConfirmModal from "~/components/confirmModal";

export const meta = () => {
  return [
    { title: "Contact Messages - CSTS Admin" },
    { name: "description", content: "Manage contact messages in the CSTS system" },
  ];
};

const Contact = () => {
  const [contacts, setContacts] = useState<ContactInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation modal
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  
  // Drawer states
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactInterface | null>(null);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact");
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setContactToDelete(id);
    onDeleteModalOpen();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: contactToDelete }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchContacts();
        successToast("Contact message deleted successfully!");
        onDeleteModalOpenChange();
        setContactToDelete(null);
      } else {
        errorToast(data.message);
      }
    } catch (err) {
      errorToast("Failed to delete contact message");
    }
  };

  // Open view drawer
  const openViewDrawer = (contact: ContactInterface) => {
    setSelectedContact(contact);
    setIsViewDrawerOpen(true);
  };

  // Table columns
  const columns: Column<ContactInterface>[] = [
    {
      key: "fullname",
      title: "Name",
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      ),
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      render: (value) => (
        <div className="text-gray-600 dark:text-gray-400">{value}</div>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (value) => (
        <div className="text-gray-600 dark:text-gray-400">{value}</div>
      ),
    },
    {
      key: "message",
      title: "Message",
      render: (value) => (
        <div className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
          {value}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Date",
      sortable: true,
      render: (value) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage contact form submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
            {contacts.length} Total Messages
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={contacts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search contact messages..."
        emptyText="No contact messages found"
        pageSize={10}
      />

      {/* View Drawer */}
      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Contact Message Details"
        size="md"
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Mail size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedContact.fullname}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedContact.createdAt && new Date(selectedContact.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <a 
                    href={`mailto:${selectedContact.email}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <a 
                    href={`tel:${selectedContact.phone}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedContact.phone}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <a
                href={`mailto:${selectedContact.email}`}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail size={16} className="mr-2" />
                Reply via Email
              </a>
              <a
                href={`tel:${selectedContact.phone}`}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Phone size={16} className="mr-2" />
                Call
              </a>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        header="Delete Contact Message"
        content="Are you sure you want to delete this contact message? This action cannot be undone."
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

export default Contact; 