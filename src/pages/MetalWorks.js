import React, { useState } from 'react';
import { Scissors, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import MetalStatsCards from '../components/metals/MetalStatsCards';
import ServiceFilters from '../components/metals/ServiceFilters';
import ServiceTable from '../components/metals/ServiceTable';
import AddServiceModal from '../components/metals/AddServiceModal';

const MetalWorks = () => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  const [services, setServices] = useState([
    {
      id: 1,
      ticketId: 'MW-2024-001',
      customerName: 'Ahmed Hassan',
      phone: '+1-555-0123',
      serviceType: 'cutting',
      material: 'Steel Plate 10mm',
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
      material: 'Aluminum Sheet 5mm',
      quantity: 8,
      unitPrice: 25.00,
      totalAmount: 200.00,
      amountPaid: 100.00,
      status: 'in_progress',
      priority: 'urgent',
      dropOffTime: '2024-12-20T11:00:00'
    }
  ]);

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

    setServices(prev => [...prev, service]);
    setNewService({
      customerName: '',
      phone: '',
      serviceType: 'cutting',
      material: '',
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

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayServices = services.filter(s => 
      new Date(s.dropOffTime).toDateString() === today
    );
    
    return {
      totalServices: todayServices.length,
      totalRevenue: todayServices.reduce((sum, s) => sum + s.amountPaid, 0),
      completedServices: todayServices.filter(s => s.status === 'completed').length,
      averageServiceValue: todayServices.length > 0 ? 
        todayServices.reduce((sum, s) => sum + s.totalAmount, 0) / todayServices.length : 0
    };
  };

  const stats = getTodayStats();

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
        
        <button 
          onClick={() => setShowServiceModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Service
        </button>
      </div>

      {/* Stats Cards */}
      <MetalStatsCards stats={stats} />

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
    </div>
  );
};

export default MetalWorks;