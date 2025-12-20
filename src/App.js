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
import CompanyInfo from './pages/CompanyInfo';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import { userProfile } from './data/mockData';
import { ActivityLogger } from './utils/activityLogger';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
      const projectsData = response.data.results || response.data;
      
      // Normalize backend data to frontend format
      const normalizedProjects = projectsData.map(project => ({
        id: project.id,
        projectId: project.projectId || project.project_id,
        clientName: project.clientName || project.client_name,
        phone: project.phone,
        chassisBrand: project.chassisBrand || project.chassis_brand,
        chassisModel: project.chassisModel || project.chassis_model,
        bodyType: project.bodyType || project.body_type,
        vehicleType: project.vehicleType || project.vehicle_type,
        clientPayment: parseFloat(project.clientPayment || project.client_payment || 0),
        materialCost: parseFloat(project.materialCost || project.material_cost || 0),
        laborCost: parseFloat(project.laborCost || project.labor_cost || 0),
        profit: parseFloat(project.profit || 0),
        profitMargin: parseFloat(project.profitMargin || project.profit_margin || 0),
        status: project.status,
        progress: parseInt(project.progress || 0),
        startDate: project.startDate || project.start_date,
        estimatedCompletion: project.estimatedCompletion || project.estimated_completion,
        completedAt: project.completedAt || project.completed_at,
        deliveredAt: project.deliveredAt || project.delivered_at,
        materials: project.materials || [],
        notes: project.notes || '',
        amountPaid: parseFloat(project.amountPaid || project.amount_paid || 0),
        createdAt: project.createdAt || project.created_at,
        updatedAt: project.updatedAt || project.updated_at
      }));
      
      setProjects(normalizedProjects);
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
    // Optimistic update - add to UI immediately
    const optimisticProject = {
      id: Date.now(),
      ...newProject,
      created_at: new Date().toISOString(),
      status: 'material_sourcing',
      progress: 15
    };
    
    setProjects([...projects, optimisticProject]);
    setIsFormOpen(false);
    
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
      // Replace optimistic project with server response
      setProjects(prev => prev.map(p => p.id === optimisticProject.id ? response.data : p));
      
      ActivityLogger.addActivity(
        'project',
        `New project created: ${newProject.projectId}`,
        'success'
      );
    } catch (error) {
      console.error('Error creating project:', error);
      // Keep optimistic project on error
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;
      console.log('Project creation failed, keeping local version');
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
        
        // Auto-calculate progress based on status with better intervals
        const progressMap = {
          'Material Sourcing': 15,
          'Welding Phase': 35,
          'In Progress': 35,
          'Painting': 55,
          'Interior Fitting': 75,
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
              <Route path="/calendar" element={<Calendar projects={projects} />} />
              <Route path="/reports" element={<Reports projects={projects} />} />
              <Route path="/company" element={<CompanyInfo />} />
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
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route for password reset */}
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;