import React, { useState, useEffect } from 'react';
import KPICards from './KPICards';
import ProjectsTable from './ProjectsTable';
import RevenueChart from './MaintenanceChart';
import RecentActivity from './RecentActivity';
import ProjectProgress from './ProjectProgress';
import AddProjectForm from './AddProjectForm';
import { Sparkles, Zap, TrendingUp, Users, Clock, ArrowRight, Play, Pause } from 'lucide-react';

const Dashboard = ({ searchTerm, projects, isFormOpen, setIsFormOpen, onAddProject, onUpdateProject }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isLive) setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.clientPayment, 0);
  const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0;

  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
      
      <div className="relative z-10 h-full overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
        
          {/* Professional Header */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Pexsteel Workshop</h1>
                    <p className="text-white/60 text-sm">Production Management Dashboard</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{activeProjects}</div>
                      <div className="text-xs text-white/60">Active Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${(totalRevenue/1000).toFixed(0)}K</div>
                      <div className="text-xs text-white/60">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{completedProjects}</div>
                      <div className="text-xs text-white/60">Completed</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white/80 text-sm font-mono">
                      {currentTime.toLocaleTimeString()}
                    </div>
                    <div className="text-white/60 text-xs">
                      {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced KPI Cards */}
          <div className="mb-10">
            <KPICards />
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-green-400 text-xs">Live updates</span>
                  </div>
                </div>
                <div className="p-4">
                  <RecentActivity />
                </div>
              </div>
            </div>
            
            {/* Performance Chart */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Performance Analytics</h3>
                  <p className="text-white/60 text-sm mt-1">Revenue trends</p>
                </div>
                <div className="p-6">
                  <RevenueChart projects={projects} />
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Quick Overview</h3>
                  <p className="text-white/60 text-sm mt-1">Key performance metrics</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-bold text-white">{activeProjects}</div>
                      <div className="text-white/60 text-sm">Active Projects</div>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                        <div className="bg-blue-400 h-1 rounded-full" style={{width: `${(activeProjects/projects.length)*100}%`}}></div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-bold text-white">{completedProjects}</div>
                      <div className="text-white/60 text-sm">Completed</div>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                        <div className="bg-green-400 h-1 rounded-full" style={{width: `${(completedProjects/projects.length)*100}%`}}></div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-bold text-white">{avgProgress.toFixed(1)}%</div>
                      <div className="text-white/60 text-sm">Average Progress</div>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                        <div className="bg-purple-400 h-1 rounded-full" style={{width: `${avgProgress}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Project Progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-3">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Project Progress Tracking</h3>
                  <p className="text-white/60 text-sm mt-1">Detailed project completion status</p>
                </div>
                <div className="p-6">
                  <ProjectProgress projects={projects} />
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section - Connected Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-0">
            {/* Projects Table - Connected Left */}
            <div className="xl:col-span-2">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 xl:rounded-l-2xl xl:rounded-r-none rounded-2xl xl:border-r-0 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Project Management</h3>
                      <p className="text-white/60 text-sm mt-1">Active vehicle body building operations</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-white/80 text-sm">
                        {projects.length} Projects
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ProjectsTable 
                    searchTerm={searchTerm} 
                    projects={projects} 
                    onUpdateProject={onUpdateProject}
                  />
                </div>
              </div>
            </div>
            
            {/* Project Progress - Connected Right */}
            <div className="xl:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 xl:rounded-r-2xl xl:rounded-l-none rounded-2xl xl:border-l-0 overflow-hidden h-full">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Progress Tracking</h3>
                  <p className="text-white/60 text-sm mt-1">Real-time updates</p>
                </div>
                <div className="p-6">
                  <ProjectProgress projects={projects} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AddProjectForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddProject={onAddProject}
      />
    </main>
  );
};

export default Dashboard;