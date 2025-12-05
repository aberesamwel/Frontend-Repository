import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Materials from './pages/Materials';
import Tools from './pages/Tools';
import MetalWorks from './pages/MetalWorks';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { projectsData, userProfile } from './data/mockData';
import { ActivityLogger } from './utils/activityLogger';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Helper functions for backward compatibility
function extractChassisFromVehicleType(vehicleType) {
  if (!vehicleType) return '';
  if (vehicleType.includes('ISUZU')) return 'ISUZU';
  if (vehicleType.includes('TATA')) return 'TATA';
  if (vehicleType.includes('FAW')) return 'FAW';
  if (vehicleType.includes('FOTON')) return 'FOTON';
  return '';
}

function extractBodyFromVehicleType(vehicleType) {
  if (!vehicleType) return '';
  if (vehicleType.includes('Closed')) return 'Closed Body';
  if (vehicleType.includes('Open')) return 'Open Body';
  if (vehicleType.includes('Plain')) return 'Plain Body';
  if (vehicleType.includes('Pickup')) return 'Pickup';
  if (vehicleType.includes('Counter')) return 'Counter Body';
  return '';
}

function AppContent() {
  const location = useLocation();
  const { getThemeClass, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState(userProfile);
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('bodycraft-projects');
    if (saved) {
      const parsedProjects = JSON.parse(saved);
      // Ensure backward compatibility for existing projects
      return parsedProjects.map(project => ({
        ...project,
        // Add default values for new fields if they don't exist
        chassisBrand: project.chassisBrand || extractChassisFromVehicleType(project.vehicleType),
        chassisModel: project.chassisModel || '',
        bodyType: project.bodyType || extractBodyFromVehicleType(project.vehicleType),
        materials: project.materials || [],
        materialCost: project.materialCost || 0
      }));
    }
    return projectsData;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bodycraft-projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = () => {
    setIsFormOpen(true);
  };

  const handleProjectSubmit = (newProject) => {
    // Ensure new project has all required fields
    const completeProject = {
      ...newProject,
      chassisBrand: newProject.chassisBrand || '',
      chassisModel: newProject.chassisModel || '',
      bodyType: newProject.bodyType || '',
      materials: newProject.materials || [],
      materialCost: newProject.materialCost || 0
    };
    
    // Deduct materials from inventory
    if (completeProject.materials && completeProject.materials.length > 0) {
      const currentMaterials = JSON.parse(localStorage.getItem('bodycraft-materials') || '[]');
      
      const updatedMaterials = currentMaterials.map(inventoryItem => {
        const usedMaterial = completeProject.materials.find(m => m.name === inventoryItem.name);
        
        if (usedMaterial) {
          const newQuantity = Math.max(0, inventoryItem.quantity - parseFloat(usedMaterial.quantity || 0));
          const newStatus = newQuantity === 0 ? 'Out of Stock' :
                           newQuantity <= 10 ? 'Critical' :
                           newQuantity <= 25 ? 'Low Stock' : 'In Stock';
          
          return {
            ...inventoryItem,
            quantity: newQuantity,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return inventoryItem;
      });
      
      localStorage.setItem('bodycraft-materials', JSON.stringify(updatedMaterials));
    }
    
    const updatedProjects = [...projects, completeProject];
    setProjects(updatedProjects);
    setIsFormOpen(false);
    
    // Log activity
    ActivityLogger.addActivity(
      'project',
      `New project created: ${completeProject.projectId} for ${completeProject.clientName}`,
      'success'
    );
  };
  
  const handleUpdateProject = (updatedProject) => {
    const oldProject = projects.find(p => p.id === updatedProject.id);
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    
    // Log activity if status changed
    if (oldProject && oldProject.status !== updatedProject.status) {
      ActivityLogger.addActivity(
        'progress',
        `${updatedProject.projectId}: Status updated to ${updatedProject.status}`,
        'info'
      );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'
    }`}>
      {/* Mobile-first layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar - Mobile: overlay, Desktop: fixed */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          profile={profile}
          setProfile={setProfile}
        />
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Mobile: full width, Desktop: flex-1 */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
          <Header 
            setSidebarOpen={setSidebarOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddProject={handleAddProject}
            profile={profile}
          />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  searchTerm={searchTerm} 
                  projects={projects}
                  isFormOpen={isFormOpen}
                  setIsFormOpen={setIsFormOpen}
                  onAddProject={handleProjectSubmit}
                  onUpdateProject={handleUpdateProject}
                />
              } />
              <Route path="/projects" element={
                <Projects 
                  projects={projects}
                  onUpdateProject={handleUpdateProject}
                  onAddProject={handleProjectSubmit}
                />
              } />
              <Route path="/clients" element={<Clients projects={projects} />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/metalworks" element={<MetalWorks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<Reports projects={projects} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}



function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;