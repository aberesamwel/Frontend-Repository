import React, { useState, useEffect } from 'react';
import { Scissors, Zap, Users, DollarSign, Clock, Plus, Search, Filter, Eye, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
      specifications: '2m x 1m rectangular cut',
      quantity: 3,
      unitPrice: 45.00,
      totalAmount: 135.00,
      amountPaid: 135.00,
      status: 'completed',
      priority: 'standard',
      dropOffTime: '2024-12-20T09:30:00',
      completedTime: '2024-12-20T14:15:00',
      pickupTime: '2024-12-20T16:45:00',
      estimatedCompletion: '2024-12-20T15:00:00',
      notes: 'Clean edges required',
      paymentHistory: [{
        amount: 135.00,
        date: '2024-12-20T16:45:00',
        method: 'cash'
      }],
      fullyPaid: true
    },
    {
      id: 2,
      ticketId: 'MW-2024-002',
      customerName: 'Maria Rodriguez',
      phone: '+1-555-0456',
      serviceType: 'bending',
      material: 'Aluminum Sheet 5mm',
      specifications: '90° bend, 500mm length',
      quantity: 8,
      unitPrice: 25.00,
      totalAmount: 200.00,
      amountPaid: 100.00,
      status: 'in_progress',
      priority: 'urgent',
      dropOffTime: '2024-12-20T11:00:00',
      completedTime: null,
      pickupTime: null,
      estimatedCompletion: '2024-12-21T10:00:00',
      notes: 'Customer needs by tomorrow morning'
    },
    {
      id: 3,
      ticketId: 'MW-2024-003',
      customerName: 'John Smith',
      phone: '+1-555-0789',
      serviceType: 'cutting',
      material: 'Stainless Steel 8mm',
      specifications: 'Custom bracket design',
      quantity: 12,
      unitPrice: 35.00,
      totalAmount: 420.00,
      amountPaid: 0.00,
      status: 'pending',
      priority: 'standard',
      dropOffTime: '2024-12-20T15:30:00',
      completedTime: null,
      pickupTime: null,
      estimatedCompletion: '2024-12-22T12:00:00',
      notes: 'Precision cutting required'
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
    specifications: '',
    quantity: 1,
    unitPrice: 0,
    priority: 'standard',
    notes: ''
  });

  const serviceTypes = [
    { id: 'cutting', name: 'Metal Cutting', icon: Scissors, color: 'blue' },
    { id: 'bending', name: 'Metal Bending', icon: Zap, color: 'orange' },
    { id: 'welding', name: 'Custom Welding', icon: Zap, color: 'red' },
    { id: 'fabrication', name: 'Fabrication', icon: Scissors, color: 'green' }
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

  const getServiceIcon = (serviceType) => {
    const service = serviceTypes.find(s => s.id === serviceType);
    return service ? service.icon : Scissors;
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
      dropOffTime: new Date().toISOString(),
      completedTime: null,
      pickupTime: null,
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    setServices(prev => [...prev, service]);
    setNewService({
      customerName: '',
      phone: '',
      serviceType: 'cutting',
      material: '',
      specifications: '',
      quantity: 1,
      unitPrice: 0,
      priority: 'standard',
      notes: ''
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

  const handlePayment = (serviceId, amount) => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const newAmountPaid = service.amountPaid + amount;
        const paymentHistory = service.paymentHistory || [];
        return {
          ...service,
          amountPaid: newAmountPaid,
          paymentHistory: [...paymentHistory, {
            amount,
            date: new Date().toISOString(),
            method: 'cash' // Default payment method
          }],
          fullyPaid: newAmountPaid >= service.totalAmount
        };
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
      pendingServices: todayServices.filter(s => s.status === 'pending').length
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Today's Services</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')}`}>{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Revenue Today</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completedServices}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingServices}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${getThemeClass('text', 'muted')}`} />
              <input
                type="text"
                placeholder="Search by customer, ticket ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className={`w-5 h-5 ${getThemeClass('text', 'muted')}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`border ${getThemeClass('border', 'primary')} rounded-lg px-3 py-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="picked_up">Picked Up</option>
            </select>
            
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className={`border ${getThemeClass('border', 'primary')} rounded-lg px-3 py-2 ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">All Services</option>
              {serviceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${getThemeClass('bg', 'tertiary')} border-b ${getThemeClass('border', 'primary')}`}>
              <tr>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Ticket</th>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Customer</th>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Service</th>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Amount</th>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Status</th>
                <th className={`text-left py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Timeline</th>
                <th className={`text-right py-4 px-6 font-semibold ${getThemeClass('text', 'primary')}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${getThemeClass('border', 'primary')}`}>
              {filteredServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.serviceType);
                const balanceAmount = service.totalAmount - service.amountPaid;
                
                return (
                  <tr key={service.id} className={`hover:${getThemeClass('bg', 'hover')} transition-colors`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          service.priority === 'rush' ? 'bg-red-100' :
                          service.priority === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <ServiceIcon className={`w-4 h-4 ${
                            service.priority === 'rush' ? 'text-red-600' :
                            service.priority === 'urgent' ? 'text-orange-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{service.ticketId}</div>
                          <div className={`text-sm ${getPriorityColor(service.priority)} capitalize`}>
                            {service.priority} Priority
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div>
                        <div className={`font-medium ${getThemeClass('text', 'primary')}`}>{service.customerName}</div>
                        <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{service.phone}</div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div>
                        <div className={`font-medium ${getThemeClass('text', 'primary')} capitalize`}>
                          {service.serviceType.replace('_', ' ')}
                        </div>
                        <div className={`text-sm ${getThemeClass('text', 'muted')}`}>{service.material}</div>
                        <div className={`text-xs ${getThemeClass('text', 'tertiary')}`}>Qty: {service.quantity}</div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div>
                        <div className={`font-bold ${getThemeClass('text', 'primary')}`}>${service.totalAmount.toFixed(2)}</div>
                        <div className={`text-sm ${service.amountPaid >= service.totalAmount ? 'text-green-600' : 'text-orange-600'}`}>
                          Paid: ${service.amountPaid.toFixed(2)}
                        </div>
                        {balanceAmount > 0 && (
                          <div className="text-sm text-red-600">
                            Balance: ${balanceAmount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                        {service.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className={`text-sm ${getThemeClass('text', 'primary')}`}>
                          Drop-off: {new Date(service.dropOffTime).toLocaleDateString()}
                        </div>
                        {service.completedTime && (
                          <div className="text-sm text-green-600">
                            Completed: {new Date(service.completedTime).toLocaleDateString()}
                          </div>
                        )}
                        {service.pickupTime && (
                          <div className="text-sm text-blue-600">
                            Picked up: {new Date(service.pickupTime).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setSelectedService(service)}
                          className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium flex items-center justify-end`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="text-xs">Details</span>
                        </button>
                        
                        {service.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(service.id, 'in_progress')}
                            className="text-orange-600 hover:text-orange-800 font-medium text-xs"
                          >
                            Start Work
                          </button>
                        )}
                        
                        {service.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(service.id, 'completed')}
                            className="text-green-600 hover:text-green-800 font-medium text-xs"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {service.status === 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(service.id, 'picked_up')}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                          >
                            Mark Picked Up
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 ${getThemeClass('border', 'primary')} border-b`}>
              <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>New Metal Works Service</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Customer Name *</label>
                  <input
                    type="text"
                    value={newService.customerName}
                    onChange={(e) => setNewService({...newService, customerName: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Phone Number *</label>
                  <input
                    type="tel"
                    value={newService.phone}
                    onChange={(e) => setNewService({...newService, phone: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Service Type *</label>
                  <select
                    value={newService.serviceType}
                    onChange={(e) => setNewService({...newService, serviceType: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {serviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Priority</label>
                  <select
                    value={newService.priority}
                    onChange={(e) => setNewService({...newService, priority: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="standard">Standard</option>
                    <option value="urgent">Urgent</option>
                    <option value="rush">Rush</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Material *</label>
                <input
                  type="text"
                  value={newService.material}
                  onChange={(e) => setNewService({...newService, material: e.target.value})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g., Steel Plate 10mm, Aluminum Sheet 5mm"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Specifications</label>
                <textarea
                  value={newService.specifications}
                  onChange={(e) => setNewService({...newService, specifications: e.target.value})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  rows="3"
                  placeholder="Detailed specifications and requirements"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newService.quantity}
                    onChange={(e) => setNewService({...newService, quantity: parseInt(e.target.value) || 1})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.unitPrice}
                    onChange={(e) => setNewService({...newService, unitPrice: parseFloat(e.target.value) || 0})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
              
              <div className={`p-4 ${getThemeClass('bg', 'tertiary')} rounded-lg`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${getThemeClass('text', 'primary')}`}>Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${(newService.quantity * newService.unitPrice).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Notes</label>
                <textarea
                  value={newService.notes}
                  onChange={(e) => setNewService({...newService, notes: e.target.value})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  rows="2"
                  placeholder="Additional notes or special instructions"
                />
              </div>
            </div>
            
            <div className={`p-6 ${getThemeClass('border', 'primary')} border-t flex space-x-3`}>
              <button
                onClick={() => setShowServiceModal(false)}
                className={`flex-1 px-4 py-2 border ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')} rounded-lg hover:${getThemeClass('bg', 'hover')} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Service Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 ${getThemeClass('border', 'primary')} border-b`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Service Details - {selectedService.ticketId}</h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className={`${getThemeClass('text', 'muted')} hover:${getThemeClass('text', 'primary')} transition-colors`}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-4 rounded-lg`}>
                <h4 className={`text-xl font-bold ${getThemeClass('text', 'primary')}`}>{selectedService.customerName}</h4>
                <p className={`${getThemeClass('text', 'tertiary')}`}>{selectedService.phone}</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedService.status)}`}>
                  {selectedService.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Service Information</h5>
                  <div className="space-y-2">
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Service:</span> <span className={`${getThemeClass('text', 'primary')} capitalize`}>{selectedService.serviceType.replace('_', ' ')}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Material:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedService.material}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Quantity:</span> <span className={`${getThemeClass('text', 'primary')}`}>{selectedService.quantity}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Priority:</span> <span className={`${getPriorityColor(selectedService.priority)} capitalize font-medium`}>{selectedService.priority}</span></p>
                  </div>
                </div>
                
                <div>
                  <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Financial Summary</h5>
                  <div className="space-y-2">
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Unit Price:</span> <span className={`${getThemeClass('text', 'primary')}`}>${selectedService.unitPrice.toFixed(2)}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Total Amount:</span> <span className="font-bold text-green-600">${selectedService.totalAmount.toFixed(2)}</span></p>
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Amount Paid:</span> <span className="font-bold text-blue-600">${selectedService.amountPaid.toFixed(2)}</span></p>
                    {selectedService.totalAmount > selectedService.amountPaid && (
                      <p><span className={`${getThemeClass('text', 'muted')}`}>Balance Due:</span> <span className="font-bold text-red-600">${(selectedService.totalAmount - selectedService.amountPaid).toFixed(2)}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {selectedService.specifications && (
                <div>
                  <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Specifications</h5>
                  <p className={`${getThemeClass('text', 'tertiary')} ${getThemeClass('bg', 'tertiary')} p-3 rounded-lg`}>{selectedService.specifications}</p>
                </div>
              )}

              <div>
                <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Timeline</h5>
                <div className="space-y-2">
                  <p><span className={`${getThemeClass('text', 'muted')}`}>Drop-off:</span> <span className={`${getThemeClass('text', 'primary')}`}>{new Date(selectedService.dropOffTime).toLocaleString()}</span></p>
                  <p><span className={`${getThemeClass('text', 'muted')}`}>Estimated Completion:</span> <span className={`${getThemeClass('text', 'primary')}`}>{new Date(selectedService.estimatedCompletion).toLocaleString()}</span></p>
                  {selectedService.completedTime && (
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Completed:</span> <span className="text-green-600">{new Date(selectedService.completedTime).toLocaleString()}</span></p>
                  )}
                  {selectedService.pickupTime && (
                    <p><span className={`${getThemeClass('text', 'muted')}`}>Picked Up:</span> <span className="text-blue-600">{new Date(selectedService.pickupTime).toLocaleString()}</span></p>
                  )}
                </div>
              </div>

              {selectedService.notes && (
                <div>
                  <h5 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3`}>Notes</h5>
                  <p className={`${getThemeClass('text', 'tertiary')} ${getThemeClass('bg', 'tertiary')} p-3 rounded-lg`}>{selectedService.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetalWorks;