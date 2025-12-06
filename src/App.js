/**
 * Main Application Component
 * 
 * Purpose: Root component that manages the entire TruckFlow Dashboard application
 * 
 * Key Features:
 * - Truck body building project management
 * - Material inventory tracking with auto-deduction
 * - Client relationship management
 * - Tools and equipment tracking
 * - Metal works service management
 * - Business analytics and reporting
 * - Theme support (light/dark/high-contrast)
 * 
 * Data Storage:
 * - Projects: localStorage 'bodycraft-projects'
 * - Materials: localStorage 'bodycraft-materials'
 * - Tools: localStorage (managed in Tools component)
 * - Metal Works: localStorage 'metalworks-services'
 * 
 * Analytics Integration:
 * - Records project creation and completion events
 * - Tracks business performance over time
 * - Generates time-based analytics (hourly, daily, monthly, yearly)
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Contacts from './pages/Contacts';
import Materials from './pages/Materials';
import Tools from './pages/Tools';
import MetalWorks from './pages/MetalWorks';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { projectsData, userProfile } from './data/mockData';
import { ActivityLogger } from './utils/activityLogger';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { businessAnalytics } from './utils/timeBasedAnalytics';

/**
 * Helper functions for backward compatibility
 * These extract chassis brand and body type from old vehicleType format
 */
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
  /**
   * Projects state - loads from localStorage with backward compatibility
   * Ensures old projects get new fields (chassisBrand, bodyType, materials)
   */
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

  // Auto-save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bodycraft-projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = () => {
    setIsFormOpen(true);
  };

  /**
   * Handles new project creation
   * - Validates and adds default values
   * - Deducts materials from inventory
   * - Records analytics event
   * - Logs activity for tracking
   */
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
    
    /**
     * Material Inventory Management
     * Automatically deducts used materials from inventory
     * Updates stock status (In Stock, Low Stock, Critical, Out of Stock)
     */
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
    
    // Record in analytics system
    businessAnalytics.recordEvent('project_created', {
      projectId: completeProject.id,
      projectNumber: completeProject.projectId,
      totalAmount: completeProject.totalCost || 0,
      clientName: completeProject.clientName,
      vehicleType: completeProject.vehicleType
    });

    // Log activity
    ActivityLogger.addActivity(
      'project',
      `New project created: ${completeProject.projectId} for ${completeProject.clientName}`,
      'success'
    );
  };
  
  /**
   * Updates existing project
   * Records analytics events for status changes (especially completion)
   * Logs activity for project tracking
   */
  const handleUpdateProject = (updatedProject) => {
    const oldProject = projects.find(p => p.id === updatedProject.id);
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    
    // Record analytics for status changes
    if (oldProject && oldProject.status !== updatedProject.status) {
      if (updatedProject.status === 'Completed') {
        businessAnalytics.recordEvent('project_completed', {
          projectId: updatedProject.id,
          projectNumber: updatedProject.projectId,
          totalAmount: updatedProject.totalCost || 0,
          clientName: updatedProject.clientName
        });
      }
      
      // Log activity
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
              <Route path="/contacts" element={<Contacts />} />
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