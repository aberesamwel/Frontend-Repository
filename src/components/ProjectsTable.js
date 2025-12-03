import React, { useMemo, useState } from 'react';
import { Eye, DollarSign, TrendingUp, Calendar, User, MoreHorizontal, X } from 'lucide-react';

const ProjectsTable = ({ searchTerm, projects, onUpdateProject }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  console.log('ProjectsTable rendered with projects:', projects);
  console.log('Search term:', searchTerm);
  
  const filteredProjects = useMemo(() => {
    console.log('Filtering projects:', projects);
    if (!searchTerm) return projects;
    return projects.filter(project => 
      project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, projects]);
  
  console.log('Filtered projects:', filteredProjects);

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
      
      // Track completion timestamp
      if (newStatus === 'Completed' && updatedProject.status !== 'Completed') {
        updates.completedAt = now.toISOString();
        updates.completedDate = now.toLocaleDateString();
        updates.completedTime = now.toLocaleTimeString();
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
          <div className="p-6 text-center text-slate-500">
            <p className="text-base">No projects found.</p>
            <p className="text-sm mt-1">Click "New Project" to add your first project.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{project.projectId.split('-')[2] || 'P'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{project.projectId}</h3>
                      <p className="text-xs text-slate-500">{project.clientName}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Vehicle Type</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{project.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contract Value</p>
                    <p className="text-sm font-semibold text-green-600">${project.clientPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Profit</p>
                    <p className={`text-sm font-semibold ${
                      project.profit > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${project.profit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  
                  {project.status === 'Completed' && !project.deliveredAt && (
                    <button 
                      onClick={() => handleDelivery(project.id)}
                      className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Mark Delivered
                    </button>
                  )}
                  
                  {project.deliveredAt && (
                    <span className="text-sm text-green-600 font-medium flex items-center">
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Project</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Financial</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Progress</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead> 
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No projects found. Click "New Project" to add your first project.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                {/* Project Info */}
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{project.projectId.split('-')[2] || 'P'}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{project.projectId}</div>
                      <div className="text-xs text-slate-500 truncate max-w-32">{project.vehicleType}</div>
                    </div>
                  </div>
                </td>

                {/* Client */}
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{project.clientName}</div>
                      <div className="text-xs text-slate-500">Started: {project.startDate}</div>
                    </div>
                  </div>
                </td>

                {/* Financial */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-semibold text-green-600">
                        ${project.clientPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Contract Value</div>
                    <div className={`text-xs font-medium ${
                      project.profit > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Profit: ${project.profit.toLocaleString()}
                    </div>
                  </div>
                </td>

                {/* Progress */}
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                      <span className="text-xs text-slate-500">
                        {project.progress === 100 ? 'Complete' : 'Active'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
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

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 transition-colors hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-xs">Details</span>
                    </button>
                    
                    {project.status === 'Completed' && !project.deliveredAt && (
                      <button 
                        onClick={() => handleDelivery(project.id)}
                        className="text-green-600 hover:text-green-800 font-medium flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-2 py-1 transition-colors hover:bg-green-50"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-xs">Deliver</span>
                      </button>
                    )}
                    
                    {project.deliveredAt && (
                      <span className="text-xs text-green-600 font-medium flex items-center">
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

      {/* Project Summary Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-lg sm:rounded-t-xl">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Project Summary</h2>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900">{selectedProject.projectId}</h3>
                <p className="text-slate-600">{selectedProject.vehicleType}</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </div>
              </div>

              {/* Client & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Client Information</h4>
                  <div className="space-y-2">
                    <p><span className="text-slate-500">Client:</span> {selectedProject.clientName}</p>
                    <p><span className="text-slate-500">Project ID:</span> {selectedProject.projectId}</p>
                    <p><span className="text-slate-500">Created:</span> {selectedProject.createdDate || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Timeline</h4>
                  <div className="space-y-2">
                    <p><span className="text-slate-500">Start Date:</span> {selectedProject.startDate}</p>
                    <p><span className="text-slate-500">Est. Completion:</span> {selectedProject.estimatedCompletion}</p>
                    {selectedProject.completedDate && (
                      <p><span className="text-slate-500">Completed:</span> {selectedProject.completedDate}</p>
                    )}
                    {selectedProject.deliveredDate && (
                      <p><span className="text-slate-500">Delivered:</span> {selectedProject.deliveredDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Financial Summary</h4>
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Client Payment</p>
                      <p className="text-lg font-bold text-green-600">${selectedProject.clientPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Costs</p>
                      <p className="text-lg font-bold text-red-600">${(selectedProject.materialCost + selectedProject.laborCost).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Material Cost</p>
                      <p className="text-md font-semibold">${selectedProject.materialCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Labor Cost</p>
                      <p className="text-md font-semibold">${selectedProject.laborCost.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Net Profit:</span>
                      <span className={`text-xl font-bold ${
                        selectedProject.profit > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${selectedProject.profit.toLocaleString()} ({selectedProject.profitMargin}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials Used */}
              {selectedProject.materials && selectedProject.materials.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Materials Used</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedProject.materials.map((material, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-slate-700">{material.name}</span>
                          <span className="text-slate-600">{material.quantity} × ${material.price} = ${material.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completion</span>
                    <span className="font-semibold">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
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