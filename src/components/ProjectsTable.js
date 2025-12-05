import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProjectStatsCards from './projects/ProjectStatsCards';
import ProjectFilters from './projects/ProjectFilters';
import ProjectTable from './projects/ProjectTable';
import ProjectDetailsModal from './projects/ProjectDetailsModal';
import Pagination from './shared/Pagination';

const ProjectsTable = ({ 
  projects, 
  onUpdateProject, 
  onAddProject, 
  searchTerm, 
  setSearchTerm 
}) => {
  const { getThemeClass } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelivery = (projectId) => {
    const updatedProject = projects.find(p => p.id === projectId);
    if (updatedProject) {
      onUpdateProject({
        ...updatedProject,
        deliveredAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} flex items-center`}>
            <Truck className="w-7 h-7 mr-3 text-blue-600" />
            Truck Body Projects
          </h1>
          <p className={`${getThemeClass('text', 'tertiary')} mt-1`}>Manage vehicle body building projects and client orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ProjectStatsCards projects={projects} />

      {/* Filters */}
      <ProjectFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddProject={onAddProject}
      />

      {/* Projects Table */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
        <ProjectTable 
          projects={paginatedProjects}
          onViewDetails={setSelectedProject}
          onDelivery={handleDelivery}
          onUpdateProject={onUpdateProject}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProjects.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default ProjectsTable;