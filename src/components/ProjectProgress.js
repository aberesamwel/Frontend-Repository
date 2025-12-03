import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Clock, MoreHorizontal, ChevronDown, Edit3, CheckCircle2 } from 'lucide-react';
import { ActivityLogger } from '../utils/activityLogger';

const ProjectProgress = ({ projects }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [projectUpdates, setProjectUpdates] = useState(() => {
    const saved = localStorage.getItem('bodycraft-project-updates');
    return saved ? JSON.parse(saved) : {};
  });
  const [editingUpdate, setEditingUpdate] = useState({ projectId: null, note: '' });

  useEffect(() => {
    localStorage.setItem('bodycraft-project-updates', JSON.stringify(projectUpdates));
  }, [projectUpdates]);
  
  const statusOptions = ['All', 'Material Sourcing', 'In Progress', 'Welding Phase', 'Quality Check', 'Interior Fitting', 'Completed'];
  
  const filteredProjects = useMemo(() => {
    if (selectedStatus === 'All') return projects;
    return projects.filter(project => project.status === selectedStatus);
  }, [projects, selectedStatus]);
  
  const getProjectUpdate = (projectId) => {
    return projectUpdates[projectId] || null;
  };

  const addProjectUpdate = (projectId, note) => {
    if (!note.trim()) return;
    
    const update = {
      id: Date.now(),
      note: note.trim(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setProjectUpdates(prev => ({
      ...prev,
      [projectId]: update
    }));
    
    // Log activity
    const project = projects.find(p => p.id === projectId);
    if (project) {
      ActivityLogger.addActivity(
        'progress',
        `${project.projectId}: Progress note updated - "${note.substring(0, 50)}${note.length > 50 ? '...' : ''}"`,
        'info'
      );
    }
    
    setEditingUpdate({ projectId: null, note: '' });
  };

  const startEditing = (projectId) => {
    const existingUpdate = getProjectUpdate(projectId);
    setEditingUpdate({ 
      projectId, 
      note: existingUpdate?.note || '' 
    });
  };

  const cancelEditing = () => {
    setEditingUpdate({ projectId: null, note: '' });
  };

  const getStatusBasedNote = (project) => {
    const notes = {
      'Material Sourcing': `Sourcing materials for ${project.vehicleType}. Coordinating with suppliers for delivery schedule.`,
      'In Progress': `${project.vehicleType} fabrication underway. Current progress at ${project.progress}% completion.`,
      'Welding Phase': `Welding operations in progress. Structural framework ${project.progress}% complete.`,
      'Quality Check': `Quality assurance phase. ${project.vehicleType} undergoing comprehensive inspection.`,
      'Interior Fitting': `Interior installation phase. Fitting components and finishing touches in progress.`,
      'Completed': `${project.vehicleType} fabrication completed. Ready for client delivery and final inspection.`
    };
    return notes[project.status] || `Project ${project.projectId} is ${project.progress}% complete.`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Project Progress</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time project status and progress tracking</p>
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
                
                {(() => {
                  const customUpdate = getProjectUpdate(project.id);
                  const isEditing = editingUpdate.projectId === project.id;
                  
                  if (isEditing) {
                    return (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <textarea
                          value={editingUpdate.note}
                          onChange={(e) => setEditingUpdate(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows="2"
                          placeholder="Add progress note..."
                          autoFocus
                        />
                        <div className="flex items-center justify-end space-x-2 mt-2">
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => addProjectUpdate(project.id, editingUpdate.note)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Save
                          </button>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="mb-3 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {customUpdate?.note || getStatusBasedNote(project)}
                          </p>
                          {customUpdate && (
                            <p className="text-xs text-slate-500 mt-1">
                              Updated: {customUpdate.date} at {customUpdate.time}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startEditing(project.id)}
                          className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-blue-600 transition-all duration-200"
                          title="Edit progress note"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <FileText className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="font-medium">{project.status}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Est. {project.estimatedCompletion}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-slate-500">
                      Progress: {project.progress}%
                    </div>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
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