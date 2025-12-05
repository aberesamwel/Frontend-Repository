import React, { useState, useEffect } from 'react';
import { Scissors, Plus, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import MetalStatsCards from '../components/metals/MetalStatsCards';
import ServiceFilters from '../components/metals/ServiceFilters';
import ServiceTable from '../components/metals/ServiceTable';
import AddServiceModal from '../components/metals/AddServiceModal';
import ServiceDetailsModal from '../components/metals/ServiceDetailsModal';
import { businessAnalytics } from '../utils/timeBasedAnalytics';

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

      {/* Modern Analytics Dashboard */}
      <MetalStatsCards stats={stats} />
      
      {/* Sales Analytics Charts */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
        <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')} mb-6`}>Sales Analytics & Performance</h3>
        
        {/* Time Period Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Performance */}
          <div className={`${getThemeClass('bg', 'primary')} rounded-lg p-4 border ${getThemeClass('border', 'secondary')}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${getThemeClass('text', 'primary')}`}>Today</h4>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Sales</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>${stats.dailySales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Collected</span>
                <span className={`font-semibold text-green-600`}>${stats.dailyPayments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Services</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>{stats.dailyServices}</span>
              </div>
            </div>
          </div>
          
          {/* Monthly Performance */}
          <div className={`${getThemeClass('bg', 'primary')} rounded-lg p-4 border ${getThemeClass('border', 'secondary')}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${getThemeClass('text', 'primary')}`}>This Month</h4>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Sales</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>${stats.monthlySales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Collected</span>
                <span className={`font-semibold text-green-600`}>${stats.monthlyPayments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Services</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>{stats.monthlyServices}</span>
              </div>
              <div className="mt-3 pt-2 border-t ${getThemeClass('border', 'secondary')}">
                <div className="flex justify-between">
                  <span className={`text-xs ${getThemeClass('text', 'muted')}`}>Collection Rate</span>
                  <span className={`text-xs font-semibold ${stats.monthlySales > 0 && (stats.monthlyPayments / stats.monthlySales * 100) > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                    {stats.monthlySales > 0 ? (stats.monthlyPayments / stats.monthlySales * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Yearly Performance */}
          <div className={`${getThemeClass('bg', 'primary')} rounded-lg p-4 border ${getThemeClass('border', 'secondary')}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${getThemeClass('text', 'primary')}`}>This Year</h4>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Sales</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>${stats.yearlySales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Collected</span>
                <span className={`font-semibold text-green-600`}>${stats.yearlyPayments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Services</span>
                <span className={`font-semibold ${getThemeClass('text', 'primary')}`}>{stats.yearlyServices}</span>
              </div>
              <div className="mt-3 pt-2 border-t ${getThemeClass('border', 'secondary')}">
                <div className="flex justify-between">
                  <span className={`text-xs ${getThemeClass('text', 'muted')}`}>Avg/Month</span>
                  <span className={`text-xs font-semibold ${getThemeClass('text', 'primary')}`}>
                    ${(stats.yearlySales / 12).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Time-Based Analytics */}
        <div className={`${getThemeClass('bg', 'primary')} rounded-lg p-6 border ${getThemeClass('border', 'secondary')}`}>
          <div className="flex items-center justify-between mb-6">
            <h4 className={`font-semibold ${getThemeClass('text', 'primary')}`}>Advanced Business Analytics</h4>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Real-time Intelligence</span>
            </div>
          </div>
          
          {/* Last 3 Days Performance */}
          <div className="mb-6">
            <h5 className={`font-medium ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Last 3 Days Performance
            </h5>
            <div className="grid grid-cols-3 gap-4">
              {businessAnalytics.getLastNDays(3).map((day, index) => (
                <div key={day.date} className={`${getThemeClass('bg', 'secondary')} rounded-lg p-4 border ${getThemeClass('border', 'primary')}`}>
                  <div className="text-center">
                    <div className={`text-xs ${getThemeClass('text', 'muted')} mb-1`}>{day.dayName}</div>
                    <div className={`text-lg font-bold ${getThemeClass('text', 'primary')}`}>${day.totalSales.toFixed(0)}</div>
                    <div className={`text-xs text-green-600`}>${day.totalPayments.toFixed(0)} collected</div>
                    <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{day.serviceCount} services</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hourly Performance Today */}
          <div className="mb-6">
            <h5 className={`font-medium ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
              <Clock className="w-4 h-4 mr-2 text-purple-500" />
              Today's Hourly Performance
            </h5>
            <div className="grid grid-cols-6 gap-2">
              {businessAnalytics.getLastNHours(6).map((hour, index) => (
                <div key={hour.hour} className={`${getThemeClass('bg', 'secondary')} rounded p-2 border ${getThemeClass('border', 'primary')} text-center`}>
                  <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{hour.time}</div>
                  <div className={`text-sm font-semibold ${getThemeClass('text', 'primary')}`}>${hour.totalSales.toFixed(0)}</div>
                  <div className={`text-xs text-blue-600`}>{hour.serviceCount}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Business Intelligence Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold text-blue-600`}>{stats.totalServices}</div>
              <div className={`text-sm ${getThemeClass('text', 'muted')}`}>Total Jobs</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-green-600`}>${stats.totalRevenue.toFixed(0)}</div>
              <div className={`text-sm ${getThemeClass('text', 'muted')}`}>Lifetime Sales</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-purple-600`}>${stats.averageJobValue.toFixed(0)}</div>
              <div className={`text-sm ${getThemeClass('text', 'muted')}`}>Avg Job Value</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${stats.completionRate > 80 ? 'text-green-600' : 'text-orange-600'}`}>{stats.completionRate.toFixed(1)}%</div>
              <div className={`text-sm ${getThemeClass('text', 'muted')}`}>Completion Rate</div>
            </div>
          </div>
          
          {/* Outstanding Balance Alert */}
          {stats.outstandingBalance > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">Outstanding Balance</span>
                <span className="text-lg font-bold text-orange-600">${stats.outstandingBalance.toFixed(2)}</span>
              </div>
              <div className="text-xs text-orange-600 mt-1">
                From {stats.pendingServices} pending jobs • Follow up for collection
              </div>
            </div>
          )}
        </div>
      </div>

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