import { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Image,
  FileText,
  Building2,
  Phone
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { LoaderFunction } from "react-router";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const meta = () => {
  return [
    { title: "Dashboard - CSTS Admin" },
    { name: "description", content: "CSTS Administration Dashboard with Analytics" },
    { name: "keywords", content: "Dashboard, Admin, Analytics, CSTS" },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "CSTS" },
    { rel: "canonical", href: "https://csts.com" },
    { property: "og:title", content: "Dashboard - CSTS Admin" },
    { property: "og:description", content: "CSTS Administration Dashboard" },
    { property: "og:url", content: "https://csts.com" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_US" },
    { property: "og:site_name", content: "CSTS" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Dashboard - CSTS Admin" },
    { name: "twitter:description", content: "CSTS Administration Dashboard" },
    { name: "twitter:image", content: "https://csts.com/og-image.png" },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "shortcut icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export const loader: LoaderFunction = async () => {
  return new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
  });
};

interface StatsData {
  users: number;
  blogs: number;
  training: number;
  events: number;
  notices: number;
  contact: number;
  gallery: number;
  directorsBank: number;
  categories: number;
  trainingTypes: number;
}

interface StatCard {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  href: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatsData>({
    users: 0,
    blogs: 0,
    training: 0,
    events: 0,
    notices: 0,
    contact: 0,
    gallery: 0,
    directorsBank: 0,
    categories: 0,
    trainingTypes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch all statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const endpoints = [
          '/api/users',
          '/api/blogs',
          '/api/training',
          '/api/events',
          '/api/notices',
          '/api/contact',
          '/api/gallery',
          '/api/directors-bank',
          '/api/categories',
          '/api/training-types'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(endpoint).then(res => res.json()).catch(() => ({ data: [] }))
          )
        );

        setStats({
          users: responses[0]?.data?.length || 0,
          blogs: responses[1]?.data?.length || 0,
          training: responses[2]?.data?.length || 0,
          events: responses[3]?.data?.length || 0,
          notices: responses[4]?.data?.length || 0,
          contact: responses[5]?.data?.length || 0,
          gallery: responses[6]?.data?.length || 0,
          directorsBank: responses[7]?.data?.length || 0,
          categories: responses[8]?.data?.length || 0,
          trainingTypes: responses[9]?.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate mock data for the last 7 days
  const generateChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const usersData = [12, 19, 15, 25, 22, 30, 28];
    const contentData = [8, 12, 10, 18, 15, 20, 16];
    const trainingData = [5, 8, 6, 12, 9, 15, 11];

    return {
      labels: days,
      datasets: [
        {
          label: 'Users Activity',
          data: usersData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Content Views',
          data: contentData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Training Enrollments',
          data: trainingData,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Activity Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Define stat cards
  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats.users,
      change: 12,
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500',
      href: '/dashboard/users'
    },
    {
      title: 'Blog Posts',
      value: stats.blogs,
      change: 8,
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/dashboard/blogs'
    },
    {
      title: 'Training Programs',
      value: stats.training,
      change: 15,
      changeType: 'increase',
      icon: GraduationCap,
      color: 'bg-yellow-500',
      href: '/dashboard/training'
    },
    {
      title: 'Events',
      value: stats.events,
      change: 3,
      changeType: 'decrease',
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/dashboard/events'
    },
    {
      title: 'Notices',
      value: stats.notices,
      change: 5,
      changeType: 'increase',
      icon: FileText,
      color: 'bg-red-500',
      href: '/dashboard/notices'
    },
    {
      title: 'Contact Messages',
      value: stats.contact,
      change: 22,
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-indigo-500',
      href: '/dashboard/contact'
    },
    {
      title: 'Gallery Items',
      value: stats.gallery,
      change: 7,
      changeType: 'increase',
      icon: Image,
      color: 'bg-pink-500',
      href: '/dashboard/gallery'
    },
    {
      title: 'Directors',
      value: stats.directorsBank,
      change: 2,
      changeType: 'increase',
      icon: Building2,
      color: 'bg-gray-500',
      href: '/dashboard/directors-bank'
    }
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to CSTS Dashboard</h1>
        <p className="text-blue-100">Monitor your system performance and manage content efficiently</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <a
              key={index}
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  <div className="flex items-center mt-1">
                    {card.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}% from last month
                    </span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h2>
          <div className="h-80">
            <Line data={generateChartData()} options={chartOptions} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Active Users</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.users}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Published Content</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.blogs + stats.notices}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-yellow-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Training Programs</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.training}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Upcoming Events</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.events}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Contact Messages</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.contact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.users + stats.contact}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Interactions</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.blogs + stats.notices + stats.training}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Content Items</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.events + stats.gallery}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Media & Events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;