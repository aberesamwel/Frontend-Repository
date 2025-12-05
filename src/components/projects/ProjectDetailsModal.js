import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProjectDetailsModal = ({ project, onClose }) => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  if (!project) return null;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${getThemeClass('bg', 'secondary')} rounded-lg sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}>
        <div className={`flex items-center justify-between p-4 sm:p-6 ${getThemeClass('border', 'primary')} border-b sticky top-0 ${getThemeClass('bg', 'secondary')} rounded-t-lg sm:rounded-t-xl`}>
          <h2 className={`text-base sm:text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Project Summary</h2>
          <button onClick={onClose} className={`${getThemeClass('text', 'muted')} hover:${getThemeClass('text', 'tertiary')} p-1 rounded-lg ${getThemeClass('bg', 'hover')} transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-4 rounded-lg`}>
            <h3 className={`text-xl font-bold ${getThemeClass('text', 'primary')}`}>{project.projectId}</h3>
            <p className={`${getThemeClass('text', 'tertiary')}`}>{project.vehicleType}</p>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 border ${getStatusColor(project.status)}`}>
              {project.status}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Client Information</h4>
              <div className="space-y-2">
                <p><span className={`${getThemeClass('text', 'muted')}`}>Client:</span> <span className={`${getThemeClass('text', 'primary')}`}>{project.clientName}</span></p>
                <p><span className={`${getThemeClass('text', 'muted')}`}>Project ID:</span> <span className={`${getThemeClass('text', 'primary')}`}>{project.projectId}</span></p>
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Timeline</h4>
              <div className="space-y-2">
                <p><span className={`${getThemeClass('text', 'muted')}`}>Start Date:</span> <span className={`${getThemeClass('text', 'primary')}`}>{project.startDate}</span></p>
                <p><span className={`${getThemeClass('text', 'muted')}`}>Est. Completion:</span> <span className={`${getThemeClass('text', 'primary')}`}>{project.estimatedCompletion}</span></p>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Financial Summary</h4>
            <div className={`${getThemeClass('bg', 'tertiary')} p-3 sm:p-4 rounded-lg`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Client Payment</p>
                  <p className="text-lg font-bold text-green-600">${project.clientPayment.toLocaleString()}</p>
                </div>
                <div>
                  <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Total Costs</p>
                  <p className="text-lg font-bold text-red-600">${(project.materialCost + project.laborCost).toLocaleString()}</p>
                </div>
              </div>
              <div className={`${getThemeClass('border', 'primary')} border-t mt-4 pt-4`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${getThemeClass('text', 'primary')}`}>Net Profit:</span>
                  <span className={`text-xl font-bold ${
                    project.profit > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${project.profit.toLocaleString()} ({project.profitMargin}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${getThemeClass('text', 'tertiary')}`}>Completion</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-3`}>
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;