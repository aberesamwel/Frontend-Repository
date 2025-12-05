import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ServiceFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  filterService, 
  setFilterService,
  serviceTypes 
}) => {
  const { getThemeClass } = useTheme();

  return (
    <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${getThemeClass('text', 'muted')}`} />
            <input
              type="text"
              placeholder="Search by customer, ticket ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className={`w-5 h-5 ${getThemeClass('text', 'muted')}`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`border ${getThemeClass('border', 'primary')} rounded-lg px-3 py-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="picked_up">Picked Up</option>
          </select>
          
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className={`border ${getThemeClass('border', 'primary')} rounded-lg px-3 py-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="all">All Services</option>
            {serviceTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters;