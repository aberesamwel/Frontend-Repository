import React, { useState, useEffect } from 'react';
import { Scissors, Plus, TrendingUp, Calendar, Clock, Download, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import MetalStatsCards from '../components/metals/MetalStatsCards';
import ServiceFilters from '../components/metals/ServiceFilters';
import ServiceTable from '../components/metals/ServiceTable';
import AddServiceModal from '../components/metals/AddServiceModal';
import ServiceDetailsModal from '../components/metals/ServiceDetailsModal';
import { businessAnalytics } from '../utils/timeBasedAnalytics';
import BusinessCalendar from '../components/analytics/BusinessCalendar';

const MetalWorks = () => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('metalworks-services');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        ticketId: 'MW-2024-001',
        customerName: 'Ahmed Hassan',
        phone: '+1-555-0123',
        serviceType: 'cutting',
        material: 'Steel Plate',
        gauge: '10mm',
        dimensions: '2m x 1m',
        specifications: 'Clean edges required, rectangular cut',
        quantity: 3,
        unitPrice: 45.00,
        totalAmount: 135.00,
        amountPaid: 135.00,
        status: 'completed',
        priority: 'standard',
        dropOffTime: '2024-12-20T09:30:00',
        completedTime: '2024-12-20T14:15:00',
        pickupTime: '2024-12-20T16:45:00'
      },
      {
        id: 2,
        ticketId: 'MW-2024-002',
        customerName: 'Maria Rodriguez',
        phone: '+1-555-0456',
        serviceType: 'bending',
        material: 'Aluminum Sheet',
        gauge: '5mm', 
        dimensions: '500mm length',
        specifications: '90° bend precision required',
        quantity: 8,
        unitPrice: 25.00,
        totalAmount: 200.00,
        amountPaid: 100.00,
        status: 'in_progress',
        priority: 'urgent',
        dropOffTime: '2024-12-20T11:00:00'
      }
    ];
  });

  // Save services to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('metalworks-services', JSON.stringify(services));
  }, [services]);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [newService, setNewService] = useState({
    customerName: '',
    phone: '',
    serviceType: 'cutting',
    material: '',
    gauge: '',
    dimensions: '',
    specifications: '',
    quantity: 1,
    unitPrice: 0,
    priority: 'standard'
  });

  const serviceTypes = [
    { id: 'cutting', name: 'Metal Cutting' },
    { id: 'bending', name: 'Metal Bending' },
    { id: 'welding', name: 'Custom Welding' },
    { id: 'fabrication', name: 'Fabrication' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: isDark ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      in_progress: isDark ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      completed: isDark ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200',
      picked_up: isDark ? 'bg-gray-900/30 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      standard: 'text-gray-500',
      urgent: 'text-orange-500',
      rush: 'text-red-500'
    };
    return colors[priority] || colors.standard;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesService = filterService === 'all' || service.serviceType === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleAddService = () => {
    if (!newService.customerName || !newService.phone || !newService.material) return;

    const service = {
      id: Date.now(),
      ticketId: `MW-2024-${String(services.length + 1).padStart(3, '0')}`,
      ...newService,
      totalAmount: newService.quantity * newService.unitPrice,
      amountPaid: 0,
      status: 'pending',
      dropOffTime: new Date().toISOString()
    };

    // Record in analytics system
    businessAnalytics.recordEvent('service_created', {
      serviceId: service.id,
      ticketId: service.ticketId,
      totalAmount: service.totalAmount,
      serviceType: service.serviceType,
      customerName: service.customerName
    });

    setServices(prev => [...prev, service]);
    setNewService({
      customerName: '',
      phone: '',
      serviceType: 'cutting',
      material: '',
      gauge: '',
      dimensions: '',
      specifications: '',
      quantity: 1,
      unitPrice: 0,
      priority: 'standard'
    });
    setShowServiceModal(false);
  };

  const handleStatusUpdate = (serviceId, newStatus) => {
    const now = new Date().toISOString();
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const updates = { status: newStatus };
        if (newStatus === 'completed') updates.completedTime = now;
        if (newStatus === 'picked_up') updates.pickupTime = now;
        return { ...service, ...updates };
      }
      return service;
    }));
  };

  const getServiceStats = () => {
    const now = new Date();
    const today = now.toDateString();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Daily Sales
    const todayServices = services.filter(s => 
      new Date(s.dropOffTime).toDateString() === today
    );
    const dailySales = todayServices.reduce((sum, s) => sum + s.totalAmount, 0);
    const dailyPayments = todayServices.reduce((sum, s) => sum + s.amountPaid, 0);
    
    // Monthly Sales
    const thisMonthServices = services.filter(s => {
      const serviceDate = new Date(s.dropOffTime);
      return serviceDate.getMonth() === thisMonth && serviceDate.getFullYear() === thisYear;
    });
    const monthlySales = thisMonthServices.reduce((sum, s) => sum + s.totalAmount, 0);
    const monthlyPayments = thisMonthServices.reduce((sum, s) => sum + s.amountPaid, 0);
    
    // Yearly Sales
    const thisYearServices = services.filter(s => {
      const serviceDate = new Date(s.dropOffTime);
      return serviceDate.getFullYear() === thisYear;
    });
    const yearlySales = thisYearServices.reduce((sum, s) => sum + s.totalAmount, 0);
    const yearlyPayments = thisYearServices.reduce((sum, s) => sum + s.amountPaid, 0);
    
    // All-time totals
    const completedServices = services.filter(s => s.status === 'completed');
    const totalRevenue = services.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPayments = services.reduce((sum, s) => sum + s.amountPaid, 0);
    
    return {
      // Daily metrics
      dailySales,
      dailyPayments,
      dailyServices: todayServices.length,
      
      // Monthly metrics
      monthlySales,
      monthlyPayments,
      monthlyServices: thisMonthServices.length,
      
      // Yearly metrics
      yearlySales,
      yearlyPayments,
      yearlyServices: thisYearServices.length,
      
      // Overall business metrics
      totalServices: services.length,
      completedServices: completedServices.length,
      pendingServices: services.filter(s => s.status === 'pending' || s.status === 'in_progress').length,
      totalRevenue,
      totalPayments,
      outstandingBalance: totalRevenue - totalPayments,
      averageJobValue: services.length > 0 ? totalRevenue / services.length : 0,
      completionRate: services.length > 0 ? (completedServices.length / services.length * 100) : 0
    };
  };

  const stats = getServiceStats();

  const generatePDFReport = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('MetalWorks Performance Report', 20, 30);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Summary Stats
    doc.setFontSize(16);
    doc.text('Business Summary', 20, 65);
    doc.setFontSize(12);
    doc.text(`Total Services: ${stats.totalServices}`, 20, 80);
    doc.text(`Total Revenue: $${stats.totalRevenue.toFixed(2)}`, 20, 90);
    doc.text(`Completed Services: ${stats.completedServices}`, 20, 100);
    doc.text(`Pending Services: ${stats.pendingServices}`, 20, 110);
    doc.text(`Average Job Value: $${stats.averageJobValue.toFixed(2)}`, 20, 120);
    doc.text(`Completion Rate: ${stats.completionRate.toFixed(1)}%`, 20, 130);
    
    // Recent Services
    doc.setFontSize(16);
    doc.text('Recent Services', 20, 150);
    doc.setFontSize(10);
    
    let yPos = 165;
    services.slice(0, 10).forEach((service, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${service.ticketId} - ${service.customerName}`, 20, yPos);
      doc.text(`${service.serviceType} - $${service.totalAmount.toFixed(2)}`, 20, yPos + 8);
      doc.text(`Status: ${service.status}`, 20, yPos + 16);
      yPos += 25;
    });
    
    doc.save(`MetalWorks-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} flex items-center`}>
            <Scissors className="w-7 h-7 mr-3 text-blue-600" />
            Metal Works Services
          </h1>
          <p className={`${getThemeClass('text', 'tertiary')} mt-1`}>Cutting, bending & custom metalwork services</p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={generatePDFReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
          <button 
            onClick={() => setShowServiceModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Service
          </button>
        </div>
      </div>

      {/* Modern Analytics Dashboard */}
      <MetalStatsCards stats={stats} />
      
      {/* Business Performance Calendar */}
      <BusinessCalendar />
        


      {/* Filters */}
      <ServiceFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterService={filterService}
        setFilterService={setFilterService}
        serviceTypes={serviceTypes}
      />

      {/* Services Table */}
      <ServiceTable 
        services={filteredServices}
        onViewDetails={setSelectedService}
        onStatusUpdate={handleStatusUpdate}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      {/* Add Service Modal */}
      <AddServiceModal 
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        newService={newService}
        setNewService={setNewService}
        onSubmit={handleAddService}
        serviceTypes={serviceTypes}
      />
      
      <ServiceDetailsModal 
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default MetalWorks;