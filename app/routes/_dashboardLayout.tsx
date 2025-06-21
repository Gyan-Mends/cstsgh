import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Users, 
  Image, 
  Phone, 
  FileText, 
  GraduationCap, 
  Building2,
  Tag,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { isAuthenticated, getUserData, logout, type UserData } from "~/utils/auth";
import { successToast } from "~/components/toast";
import { Button, useDisclosure } from "@heroui/react";
import ConfirmModal from "~/components/confirmModal";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if dark mode is already active or preferred
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Logout confirmation modal
  const { isOpen: isLogoutModalOpen, onOpen: onLogoutModalOpen, onOpenChange: onLogoutModalOpenChange } = useDisclosure();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    // Get user data
    const userData = getUserData();
    setUser(userData);
  }, [navigate]);

  // Apply initial dark mode state to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Blogs", href: "/dashboard/blogs", icon: BookOpen },
    { name: "Training", href: "/dashboard/training", icon: GraduationCap },
    { name: "Training Types", href: "/dashboard/training-types", icon: Tag },
    { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Gallery", href: "/dashboard/gallery", icon: Image },
    { name: "Notices", href: "/dashboard/notices", icon: FileText },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Directors Bank", href: "/dashboard/directors-bank", icon: Building2 },
    { name: "Contact", href: "/dashboard/contact", icon: Phone },
  ];

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const openLogoutModal = () => {
    onLogoutModalOpen();
  };

  const handleLogout = () => {
    logout();
    successToast("Logged out successfully");
    navigate("/login");
    onLogoutModalOpenChange();
  };

  // Get user initials for avatar
  const getUserInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't render if not authenticated
  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">CSTS Admin</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <IconComponent size={20} />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {!isSidebarCollapsed && (
              <span className="ml-3">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
          
          <Link
            to="/dashboard/settings"
            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            } ${location.pathname === '/dashboard/settings' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ''}`}
            title={isSidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings size={20} />
            {!isSidebarCollapsed && (
              <span className="ml-3">Settings</span>
            )}
          </Link>
          
          <button
            onClick={openLogoutModal}
            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title={isSidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`dashboard-content transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Welcome to CSTS Administration Panel
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.base64Image ? (
                      <img 
                        src={user.base64Image} 
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {getUserInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onOpenChange={onLogoutModalOpenChange}
        header="Confirm Logout"
        content="Are you sure you want to logout? You will need to login again to access the dashboard."
      >
        <div className="flex gap-3">
          <Button
            variant="flat"
            color="default"
            onPress={() => onLogoutModalOpenChange()}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default DashboardLayout;
