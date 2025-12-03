import React from 'react';
import KPICards from './KPICards';
import ProjectsTable from './ProjectsTable';
import RevenueChart from './MaintenanceChart';
import RecentActivity from './RecentActivity';
import ProjectProgress from './ProjectProgress';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ searchTerm, projects, isFormOpen, setIsFormOpen, onAddProject, onUpdateProject }) => {
  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-600">Monitor your workshop performance and project progress</p>
        </div>

        {/* KPI Cards - Full Width */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="space-y-8">
          
          {/* Projects Section - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Active Projects</h2>
                  <p className="text-sm text-slate-500 mt-1">Track your vehicle body building projects</p>
                </div>
                <div className="text-sm text-slate-500">
                  {projects.length} total projects
                </div>
              </div>
            </div>
            <ProjectsTable 
              searchTerm={searchTerm} 
              projects={projects} 
              onUpdateProject={onUpdateProject}
            />
          </div>

          {/* Two Column Section for Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Revenue Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RevenueChart projects={projects} />
            </div>
            
            {/* Recent Activity - Takes 1 column */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>

          {/* Project Progress - Full Width on Mobile, Hidden on Desktop */}
          <div className="lg:hidden">
            <ProjectProgress projects={projects} />
          </div>

          {/* Quick Stats for Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Workshop Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {projects.filter(p => p.status === 'Completed').length}
                  </div>
                  <div className="text-sm text-slate-600">Completed Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {projects.filter(p => p.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-slate-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {projects.filter(p => p.status === 'Material Sourcing').length}
                  </div>
                  <div className="text-sm text-slate-600">Material Sourcing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    ${(projects.reduce((sum, p) => sum + p.clientPayment, 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-slate-600">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Modal */}
      <AddProjectForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddProject={onAddProject}
      />
    </main>
  );
};

export default Dashboard;