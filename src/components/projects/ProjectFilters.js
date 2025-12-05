import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProjectFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  onAddProject 
}) => {
  const { getThemeClass } = useTheme();

  const statusOptions = [
    'All Status',
    'Material Sourcing',
    'In Progress', 
    'Welding Phase',
    'Quality Check',
    'Interior Fitting',
    'Completed'
  ];

  return (
    <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${getThemeClass('text', 'muted')}`} />
              <input
                type="text"
                placeholder="Search projects, clients, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${getThemeClass('text', 'muted')}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`border ${getThemeClass('border', 'primary')} rounded-lg px-3 py-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          onClick={onAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>
    </div>
  );
};

export default ProjectFilters;