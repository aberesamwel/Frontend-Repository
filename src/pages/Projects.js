import React from 'react';
import ProjectsTable from '../components/ProjectsTable';
import AddProjectForm from '../components/AddProjectForm';
import BusinessCalendar from '../components/analytics/BusinessCalendar';
import { businessAnalytics } from '../utils/timeBasedAnalytics';

const Projects = ({ projects, onUpdateProject, onAddProject }) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage all vehicle body building projects</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          New Project
        </button>
      </div>
      
      <ProjectsTable 
        searchTerm="" 
        projects={projects} 
        onUpdateProject={onUpdateProject}
      />
      
      {/* Project Performance Analytics */}
      <div className="mt-8">
        <BusinessCalendar />
      </div>
      
      <AddProjectForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddProject={onAddProject}
        existingProjects={projects}
      />
    </div>
  );
};

export default Projects;