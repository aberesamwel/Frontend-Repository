import React, { useMemo, useState } from 'react';
import { Eye, DollarSign, TrendingUp, Calendar, User, MoreHorizontal, X } from 'lucide-react';
import { ActivityLogger } from '../utils/activityLogger';
import { useTheme } from '../contexts/ThemeContext';

const ProjectsTable = ({ searchTerm, projects, onUpdateProject }) => {
  const { getThemeClass, isDark } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter(project => 
      project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, projects]);

  const statusOptions = ['Material Sourcing', 'In Progress', 'Welding Phase', 'Quality Check', 'Interior Fitting', 'Completed'];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Material Sourcing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Welding Phase': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Quality Check': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Interior Fitting': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleStatusChange = (projectId, newStatus) => {
    const updatedProject = projects.find(p => p.id === projectId);
    if (updatedProject) {
      const progressMap = {
        'Material Sourcing': 10,
        'In Progress': 35,
        'Welding Phase': 55,
        'Quality Check': 80,
        'Interior Fitting': 90,
        'Completed': 100
      };
      
      const now = new Date();
      const updates = {
        ...updatedProject,
        status: newStatus,
        progress: progressMap[newStatus] || updatedProject.progress
      };
      
      if (newStatus === 'Completed' && updatedProject.status !== 'Completed') {
        updates.completedAt = now.toISOString();
        updates.completedDate = now.toLocaleDateString();
        updates.completedTime = now.toLocaleTimeString();
        
        ActivityLogger.addActivity(
          'progress',
          `${updatedProject.projectId}: Project completed! Ready for delivery`,
          'success'
        );
      } else {
        ActivityLogger.addActivity(
          'progress',
          `${updatedProject.projectId}: Status updated to ${newStatus} - ${progressMap[newStatus]}% progress`,
          'info'
        );
      }
      
      onUpdateProject(updates);
    }
  };
  
  const handleDelivery = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project && project.status === 'Completed') {
      const now = new Date();
      onUpdateProject({
        ...project,
        deliveredAt: now.toISOString(),
        deliveredDate: now.toLocaleDateString(),
        deliveredTime: now.toLocaleTimeString()
      });
      
      ActivityLogger.addActivity(
        'delivery',
        `${project.projectId}: Vehicle delivered to ${project.clientName}`,
        'success'
      );
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="">
      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        {filteredProjects.length === 0 ? (
          <div className={`p-6 text-center ${getThemeClass('text', 'muted')}`}>
            <p className="text-base">No projects found.</p>
            <p className="text-sm mt-1">Click "New Project" to add your first project.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className={`${getThemeClass('bg', 'secondary')} rounded-lg p-4 ${getThemeClass('border', 'primary')} border hover:shadow-md transition-all`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{project.projectId.split('-')[2] || 'P'}</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${getThemeClass('text', 'primary')} text-sm`}>{project.projectId}</h3>
                      <p className={`text-xs ${getThemeClass('text', 'muted')}`}>{project.clientName}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className={`text-xs ${getThemeClass('text', 'muted')} mb-1`}>Vehicle Type</p>
                    <p className={`text-sm font-medium ${getThemeClass('text', 'primary')} truncate`}>{project.vehicleType}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${getThemeClass('text', 'muted')} mb-1`}>Contract Value</p>
                    <p className="text-sm font-semibold text-green-600">${project.clientPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${getThemeClass('text', 'muted')} mb-1`}>Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className={`flex-1 ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2`}>
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getThemeClass('text', 'tertiary')}`}>{project.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs ${getThemeClass('text', 'muted')} mb-1`}>Profit</p>
                    <p className={`text-sm font-semibold ${
                      project.profit > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${project.profit.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 ${getThemeClass('border', 'primary')} border-t`}>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium text-sm flex items-center`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  
                  {project.status === 'Completed' && !project.deliveredAt && (
                    <button 
                      onClick={() => handleDelivery(project.id)}
                      className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} font-medium text-sm flex items-center`}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Mark Delivered
                    </button>
                  )}
                  
                  {project.deliveredAt && (
                    <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'} font-medium flex items-center`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      Delivered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'} border-b`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>Project</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>Status</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>Progress</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <tbody className={`${isDark ? 'divide-white/10' : 'divide-slate-200'} divide-y`}>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={`px-6 py-12 text-center ${getThemeClass('text', 'muted')}`}>
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 ${isDark ? 'bg-white/10' : 'bg-slate-100'} rounded-full flex items-center justify-center mb-4`}>
                          <Eye className={`w-8 h-8 ${getThemeClass('text', 'muted')}`} />
                        </div>
                        <p className={`text-lg font-medium ${getThemeClass('text', 'secondary')}`}>No projects found</p>
                        <p className={`text-sm ${getThemeClass('text', 'muted')} mt-1`}>Click "New Project" to add your first project</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project, index) => (
                  <tr key={project.id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all duration-200`}>
                    {/* Project Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{project.projectId.split('-')[2] || 'P'}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-semibold ${getThemeClass('text', 'primary')}`}>{project.projectId}</div>
                          <div className={`text-xs ${getThemeClass('text', 'tertiary')} truncate`}>{project.clientName}</div>
                          <div className={`text-xs ${getThemeClass('text', 'muted')} mt-1`}>{project.vehicleType}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className={`text-xs font-medium rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${getStatusColor(project.status)} hover:shadow-md`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>{project.progress}%</span>
                          <span className={`text-xs ${getThemeClass('text', 'tertiary')}`}>
                            ${(project.clientPayment/1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2`}>
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => setSelectedProject(project)}
                          className={`${isDark ? 'text-blue-400 hover:text-blue-300 hover:bg-white/10' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'} font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 transition-colors`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="text-xs">Details</span>
                        </button>
                        
                        {project.status === 'Completed' && !project.deliveredAt && (
                          <button 
                            onClick={() => handleDelivery(project.id)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Project Summary Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${getThemeClass('bg', 'secondary')} rounded-lg sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between p-4 sm:p-6 ${getThemeClass('border', 'primary')} border-b sticky top-0 ${getThemeClass('bg', 'secondary')} rounded-t-lg sm:rounded-t-xl`}>
              <h2 className={`text-base sm:text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Project Summary</h2>
              <button onClick={() => setSelectedProject(null)} className={`${getThemeClass('text', 'muted')} hover:${getThemeClass('text', 'tertiary')} p-1 rounded-lg ${getThemeClass('bg', 'hover')} transition-colors`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-4 rounded-lg`}>
                <h3 className={`text-xl font-bold ${getThemeClass('text', 'primary')}`}>{selectedProject.projectId}</h3>
                <p className={`${getThemeClass('text', 'tertiary')}`}>{selectedProject.vehicleType}</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Client Information</h4>
                  <div className="space-y-2">
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Client:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedProject.clientName}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Project ID:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedProject.projectId}</span></p>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Timeline</h4>
                  <div className="space-y-2">
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Start Date:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedProject.startDate}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Est. Completion:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedProject.estimatedCompletion}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Financial Summary</h4>
                <div className={`${getThemeClass('bg', 'tertiary')} p-3 sm:p-4 rounded-lg`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Client Payment</p>
                      <p className="text-lg font-bold text-green-600">${selectedProject.clientPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Total Costs</p>
                      <p className="text-lg font-bold text-red-600">${(selectedProject.materialCost + selectedProject.laborCost).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`${getThemeClass('border', 'primary')} border-t mt-4 pt-4`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-lg font-bold ${getThemeClass('text', 'primary')}`}>Net Profit:</span>
                      <span className={`text-xl font-bold ${
                        selectedProject.profit > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${selectedProject.profit.toLocaleString()} ({selectedProject.profitMargin}%)
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
                    <span className="font-semibold">{selectedProject.progress}%</span>
                  </div>
                  <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-3`}>
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(selectedProject.progress)}`}
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;