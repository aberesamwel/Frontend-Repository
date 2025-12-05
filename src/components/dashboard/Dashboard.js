import React, { useState, useEffect } from 'react';
import KPICards from './KPICards';
import ProjectsTable from '../ProjectsTable';
import { Sparkles, Zap, TrendingUp, Users, Clock, ArrowRight, Play, Pause } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = ({ searchTerm, projects, isFormOpen, setIsFormOpen, onAddProject, onUpdateProject }) => {
  const { getThemeClass, isDark } = useTheme();
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
    <main className="flex-1 overflow-hidden relative">
      {/* Animated Background */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
        </>
      )}
      
      <div className="relative z-10 h-full overflow-auto">
        <div className="h-full px-6 py-6 flex flex-col">
        


          {/* KPI Cards */}
          <div className="mb-6">
            <KPICards projects={projects} />
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Activity Feed */}
            <div className="lg:col-span-1">
              <div className={`${getThemeClass('bg', 'card')} ${getThemeClass('border', 'primary')} border rounded-2xl overflow-hidden h-full flex flex-col shadow-xl`}>
                <div className={`p-4 ${getThemeClass('border', 'primary')} border-b`}>
                  <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Recent Activity</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Live updates</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-700">Project VB-2024-001 status updated to Quality Check</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">New project VB-2024-006 added for Metro Logistics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Projects & Progress */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Projects Overview */}
              <div className={`${getThemeClass('bg', 'card')} ${getThemeClass('border', 'primary')} border rounded-2xl overflow-hidden flex flex-col shadow-xl`} style={{height: 'calc(60% - 12px)'}}>
                <div className={`p-4 ${getThemeClass('border', 'primary')} border-b`}>
                  <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Recent Projects</h3>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-3">
                    {projects.slice(0, 4).map(project => (
                      <div key={project.id} className={`p-3 rounded-lg ${getThemeClass('bg', 'tertiary')} border ${getThemeClass('border', 'primary')}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{project.projectId}</div>
                            <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{project.clientName}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>{project.progress}%</div>
                            <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{project.status}</div>
                          </div>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2 mt-2`}>
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Project Progress */}
              <div className={`${getThemeClass('bg', 'card')} ${getThemeClass('border', 'primary')} border rounded-2xl overflow-hidden flex flex-col shadow-xl`} style={{height: 'calc(40% - 12px)'}}>
                <div className={`p-4 ${getThemeClass('border', 'primary')} border-b`}>
                  <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Progress Tracking</h3>
                  <p className={`${getThemeClass('text', 'tertiary')} text-sm mt-1`}>Real-time updates</p>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {projects.slice(0, 3).map(project => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${getThemeClass('text', 'primary')}`}>{project.projectId}</span>
                          <span className={`text-sm ${getThemeClass('text', 'secondary')}`}>{project.progress}%</span>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-white/20' : 'bg-slate-200'} rounded-full h-2`}>
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Project Form will be handled by parent component */}
    </main>
  );
};

export default Dashboard;