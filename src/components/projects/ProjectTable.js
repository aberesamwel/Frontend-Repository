import React from 'react';
import { Eye, Calendar, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProjectTable = ({ 
  projects, 
  onViewDetails, 
  onDelivery, 
  onUpdateProject 
}) => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  const statusOptions = [
    'Material Sourcing',
    'In Progress', 
    'Welding Phase',
    'Quality Check',
    'Interior Fitting',
    'Completed'
  ];

  // Convert snake_case from backend to Title Case for display
  const formatStatus = (status) => {
    const statusMap = {
      'material_sourcing': 'Material Sourcing',
      'welding_phase': 'Welding Phase',
      'painting': 'Painting',
      'interior_fitting': 'Interior Fitting',
      'quality_check': 'Quality Check',
      'completed': 'Completed',
      'delivered': 'Delivered'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Material Sourcing': isDark ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'In Progress': isDark ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      'Welding Phase': isDark ? 'bg-orange-900/30 text-orange-300 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200',
      'Quality Check': isDark ? 'bg-purple-900/30 text-purple-300 border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200',
      'Interior Fitting': isDark ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Completed': isDark ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[status] || colors['In Progress'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className={`${getThemeClass('bg', 'tertiary')} border-b ${getThemeClass('border', 'primary')}`}>
            <tr>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Project</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Client</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Status</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Progress</th>
              <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Financial</th>
              <th className={`text-right py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${getThemeClass('border', 'primary')}`}>
            {projects.map((project) => (
              <tr key={project.id} className={`hover:${getThemeClass('bg', 'hover')} transition-colors`}>
                <td className="px-4 py-4">
                  <div>
                    <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{project.projectId || 'N/A'}</div>
                    <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{project.vehicleType || 'N/A'}</div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{project.clientName || 'N/A'}</div>
                </td>

                <td className="px-4 py-4">
                  <select
                    value={formatStatus(project.status)}
                    onChange={(e) => onUpdateProject({...project, status: e.target.value})}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${getStatusColor(formatStatus(project.status))} hover:shadow-md`}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>{project.progress || 0}%</span>
                      <span className={`text-xs ${getThemeClass('text', 'tertiary')}`}>
                        ${((project.clientPayment || 0)/1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-bold text-green-600">${(project.clientPayment || 0).toLocaleString()}</div>
                    <div className={`text-xs ${(project.profit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Profit: ${(project.profit || 0).toLocaleString()}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => onViewDetails(project)}
                      className={`${isDark ? 'text-blue-400 hover:text-blue-300 hover:bg-white/10' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'} font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 transition-colors`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-xs">Details</span>
                    </button>
                    
                    {project.status === 'Completed' && !project.deliveredAt && (
                      <button 
                        onClick={() => onDelivery(project.id)}
                        className={`${isDark ? 'text-green-400 hover:text-green-300 hover:bg-white/10' : 'text-green-600 hover:text-green-800 hover:bg-green-50'} font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-2 py-1 transition-colors`}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-xs">Deliver</span>
                      </button>
                    )}
                    
                    {project.deliveredAt && (
                      <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} font-medium flex items-center`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        Delivered
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {projects.map((project) => (
            <div key={project.id} className={`p-4 hover:${getThemeClass('bg', 'hover')} transition-colors`}>
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${getThemeClass('text', 'primary')} truncate`}>
                    {project.projectId || 'N/A'}
                  </div>
                  <div className={`text-sm ${getThemeClass('text', 'muted')} truncate`}>
                    {project.clientName || 'N/A'}
                  </div>
                </div>
                <button 
                  onClick={() => onViewDetails(project)}
                  className={`p-2 ${isDark ? 'text-blue-400 hover:bg-white/10' : 'text-blue-600 hover:bg-blue-50'} rounded-lg transition-colors touch-manipulation`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <select
                    value={formatStatus(project.status)}
                    onChange={(e) => onUpdateProject({...project, status: e.target.value})}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${getStatusColor(formatStatus(project.status))} hover:shadow-md touch-manipulation`}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>
                    {project.progress || 0}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>

                {/* Financial Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-green-600">
                      ${(project.clientPayment || 0).toLocaleString()}
                    </div>
                    <div className={`text-xs ${(project.profit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Profit: ${(project.profit || 0).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {project.status === 'Completed' && !project.deliveredAt && (
                      <button 
                        onClick={() => onDelivery(project.id)}
                        className={`px-3 py-1.5 ${isDark ? 'text-green-400 hover:bg-white/10' : 'text-green-600 hover:bg-green-50'} font-medium text-xs rounded-lg transition-colors touch-manipulation border border-current`}
                      >
                        Deliver
                      </button>
                    )}
                    
                    {project.deliveredAt && (
                      <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} font-medium flex items-center px-2 py-1 rounded-lg bg-green-50`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        Delivered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;