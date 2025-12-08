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
import Materials from './pages/Materials';
import Tools from './pages/Tools';
import MetalWorks from './pages/MetalWorks';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { userProfile } from './data/mockData';
import { ActivityLogger } from './utils/activityLogger';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { businessAnalytics } from './utils/timeBasedAnalytics';
import { projectService } from './services/projectService';
import { clientService } from './services/clientService';

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
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load projects from API
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      setProjects(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
  const handleProjectSubmit = async (newProject) => {
    try {
      const projectData = {
        project_id: newProject.projectId,
        client_name: newProject.clientName,
        phone: newProject.phone,
        chassis_brand: newProject.chassisBrand,
        chassis_model: newProject.chassisModel,
        body_type: newProject.bodyType,
        vehicle_type: newProject.vehicleType,
        client_payment: parseFloat(newProject.clientPayment),
        labor_cost: parseFloat(newProject.laborCost),
        start_date: newProject.startDate,
        estimated_completion: newProject.estimatedCompletion,
        materials: newProject.materials?.map(m => ({
          material_name: m.name,
          quantity: parseFloat(m.quantity),
          unit: m.unit,
          unit_price: parseFloat(m.price),
          total_cost: parseFloat(m.total)
        })) || []
      };

      const response = await projectService.create(projectData);
      setProjects([...projects, response.data]);
      setIsFormOpen(false);
      
      ActivityLogger.addActivity(
        'project',
        `New project created: ${newProject.projectId}`,
        'success'
      );
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;
      alert('Failed to create project: ' + errorMsg);
    }
  };
  
  /**
   * Updates existing project
   * Records analytics events for status changes (especially completion)
   * Logs activity for project tracking
   */
  const handleUpdateProject = async (updatedProject) => {
    try {
      const updateData = {};
      
      if (updatedProject.status !== undefined) {
        // Convert frontend status to backend format
        const statusMap = {
          'Material Sourcing': 'material_sourcing',
          'Welding Phase': 'welding_phase',
          'Painting': 'painting',
          'Interior Fitting': 'interior_fitting',
          'Quality Check': 'quality_check',
          'Completed': 'completed',
          'Delivered': 'delivered',
          'In Progress': 'welding_phase'
        };
        updateData.status = statusMap[updatedProject.status] || updatedProject.status.toLowerCase().replace(/ /g, '_');
        
        // Auto-calculate progress based on status
        const progressMap = {
          'Material Sourcing': 10,
          'Welding Phase': 30,
          'In Progress': 30,
          'Painting': 50,
          'Interior Fitting': 70,
          'Quality Check': 90,
          'Completed': 100,
          'Delivered': 100
        };
        updateData.progress = progressMap[updatedProject.status] || 0;
      }
      if (updatedProject.amount_paid !== undefined || updatedProject.amountPaid !== undefined) {
        updateData.amount_paid = parseFloat(updatedProject.amount_paid || updatedProject.amountPaid) || 0;
      }
      if (updatedProject.notes !== undefined) updateData.notes = updatedProject.notes || '';
      if (updatedProject.deliveredAt !== undefined) updateData.delivered_at = updatedProject.deliveredAt;
      if (updatedProject.completedAt !== undefined) updateData.completed_at = updatedProject.completedAt;

      console.log('Updating project:', updatedProject.id);
      console.log('Update data:', updateData);
      
      // Send to backend
      const response = await projectService.update(updatedProject.id, updateData);
      console.log('Backend response:', response.data);
      console.log('Backend response status:', response.data.status);
      console.log('Backend response progress:', response.data.progress);
      console.log('Backend response progress:', response.data.progress);
      
      // Update with backend response using functional setState
      setProjects(prevProjects => {
        const updated = prevProjects.map(p => {
          if (p.id === updatedProject.id) {
            console.log('Updating project in state:', p.id);
            console.log('Old status:', p.status);
            console.log('New status:', response.data.status);
            return response.data;
          }
          return p;
        });
        console.log('Updated projects array:', updated);
        return updated;
      });
      
      ActivityLogger.addActivity(
        'progress',
        `Project updated: ${updatedProject.project_id || updatedProject.projectId}`,
        'info'
      );
    } catch (error) {
      console.error('Error updating project:', error);
      console.error('Update data that failed:', error.config?.data);
      console.error('Error response:', error.response?.data);
      const errorDetails = JSON.stringify(error.response?.data || {});
      alert('Failed to update project: ' + errorDetails);
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



// localStorage clearing disabled - data persistence enabled
// Uncomment below lines only if you need to clear data manually
// localStorage.removeItem('metalworks-services');
// localStorage.removeItem('bodycraft-materials');
// localStorage.removeItem('bodycraft-tools');
// localStorage.removeItem('pexsteel-contacts');

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