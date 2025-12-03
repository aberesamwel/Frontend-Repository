import React, { useState, useMemo } from 'react';
import { Camera, Video, FileText, Clock, MoreHorizontal, ChevronDown } from 'lucide-react';

const ProjectProgress = ({ projects }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const statusOptions = ['All', 'Material Sourcing', 'In Progress', 'Welding Phase', 'Quality Check', 'Interior Fitting', 'Completed'];
  
  const filteredProjects = useMemo(() => {
    if (selectedStatus === 'All') return projects;
    return projects.filter(project => project.status === selectedStatus);
  }, [projects, selectedStatus]);
  
  const generateProgressNotes = (project) => {
    const notes = {
      'Material Sourcing': `Materials being sourced for ${project.vehicleType}. Estimated completion in 2 weeks.`,
      'In Progress': `${project.vehicleType} construction is ${project.progress}% complete. On schedule.`,
      'Welding Phase': `Welding operations in progress. Frame assembly ${project.progress}% complete.`,
      'Quality Check': `Quality inspection phase. ${project.vehicleType} undergoing final checks.`,
      'Interior Fitting': `Interior components being installed. ${project.progress}% complete.`,
      'Completed': `${project.vehicleType} completed and ready for delivery.`
    };
    return notes[project.status] || `Project ${project.projectId} is ${project.progress}% complete.`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Project Updates</h2>
            <p className="text-sm text-slate-500 mt-1">Latest progress photos and videos for client tracking</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        {/* Status Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No projects found with status: {selectedStatus}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{project.projectId}</h3>
                    <p className="text-sm text-blue-600 font-medium">{project.status}</p>
                    <p className="text-xs text-slate-500 mt-1">{project.clientName}</p>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.startDate}
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 mb-3">{generateProgressNotes(project)}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Camera className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{Math.floor(Math.random() * 15) + 3} Photos</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Video className="w-4 h-4 mr-1 text-red-500" />
                      <span>{Math.floor(Math.random() * 5) + 1} Videos</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Gallery
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    Progress: {project.progress}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
          View All Updates
        </button>
      </div>
    </div>
  );
};

export default ProjectProgress;