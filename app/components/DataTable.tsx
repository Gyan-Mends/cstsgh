import { useState } from "react";
import { Search, ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

interface Action<T> {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: (record: T) => void;
  color?: "blue" | "indigo" | "red" | "green" | "yellow";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyIcon?: React.ComponentType<{ size?: number }>;
  loading?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchable?: boolean;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon,
  loading = false,
  onSearch,
  searchable = true,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Get nested value from object
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filter and sort data
  const processedData = data
    .filter((item) => {
      if (!searchTerm || onSearch) return true;
      
      return columns.some((column) => {
        const value = getNestedValue(item, column.key as string);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const aValue = getNestedValue(a, sortColumn);
      const bValue = getNestedValue(b, sortColumn);
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const getActionColor = (color: string = "blue") => {
    const colors = {
      blue: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
      indigo: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
      red: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
      green: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300",
      yellow: "text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" : ""
                  } ${column.width ? column.width : ""}`}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          size={12} 
                          className={`${
                            sortColumn === column.key && sortDirection === "asc" 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-400"
                          }`} 
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${
                            sortColumn === column.key && sortDirection === "desc" 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-400"
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {processedData.map((item, index) => (
              <tr key={item._id || item.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((column) => (
                  <td key={column.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {column.render 
                      ? column.render(getNestedValue(item, column.key as string), item)
                      : getNestedValue(item, column.key as string)
                    }
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {actions.map((action, actionIndex) => {
                        const IconComponent = action.icon;
                        return (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={getActionColor(action.color)}
                            title={action.label}
                          >
                            <IconComponent size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {processedData.length === 0 && (
        <div className="text-center py-12">
          {EmptyIcon && <EmptyIcon size={48} className="mx-auto text-gray-400 mb-4" />}
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default DataTable; 