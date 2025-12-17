import React, { useState, useEffect } from 'react';
import { Hammer, Search, Plus, Clock, User, MapPin, AlertCircle, CheckCircle, Wrench, Filter, ChevronDown } from 'lucide-react';
import { toolService } from '../services/toolService';
import Pagination from '../components/shared/Pagination';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTools = async () => {
      try {
        const response = await toolService.getAll();
        setTools(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTool, setSelectedTool] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    employeeName: '',
    notes: ''
  });
  const [addToolForm, setAddToolForm] = useState({
    name: '',
    category: '',
    serialNumber: '',
    condition: 'Good',
    quantity: 1,
    notes: ''
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tool.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'checked_out': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return CheckCircle;
      case 'checked_out': return Clock;
      case 'maintenance': return AlertCircle;
      default: return Hammer;
    }
  };

  const handleCheckout = (tool) => {
    setSelectedTool(tool);
    setShowCheckoutModal(true);
  };

  const handleReturn = async (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    try {
      await toolService.return(toolId, tool.checkedOutBy || 'Unknown', tool.condition, '');
      const response = await toolService.getAll();
      setTools(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error returning tool:', error);
    }
  };

  const handleToolAction = (toolId, actionId) => {
    const now = new Date();
    
    switch(actionId) {
      case 'checkout':
        const tool = tools.find(t => t.id === toolId);
        handleCheckout(tool);
        break;
      case 'maintenance':
        handleMaintenance(toolId, 'routine', 'Medium');
        break;
      case 'inspect':
        // Quick inspection logic
        break;
      case 'return':
        handleReturn(toolId);
        break;
      case 'return_maintenance':
        handleReturn(toolId);
        setTimeout(() => handleMaintenance(toolId, 'routine', 'Medium'), 100);
        break;
      case 'extend':
        // Extend checkout logic
        break;
      case 'complete':
        handleMaintenance(toolId, 'complete');
        break;
      case 'update_status':
        // Update maintenance status logic
        break;
      case 'escalate':
        // Escalate issue logic
        break;
    }
  };

  const handleMaintenance = (toolId, maintenanceType, priority = 'Medium') => {
    const now = new Date();
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { 
            ...tool, 
            status: maintenanceType === 'complete' ? 'available' : 'maintenance',
            maintenanceStarted: maintenanceType !== 'complete' ? now.toISOString() : tool.maintenanceStarted,
            maintenanceCompleted: maintenanceType === 'complete' ? now.toISOString() : null,
            maintenanceType: maintenanceType !== 'complete' ? maintenanceType : null,
            maintenancePriority: maintenanceType !== 'complete' ? priority : null,
            checkedOutBy: null,
            checkedOutTime: null
          }
        : tool
    ));
  };

  const ActionDropdown = ({ tool, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getActions = () => {
      switch(tool.status) {
        case 'available':
          return [
            { id: 'checkout', label: '📋 Check Out', icon: '👤', color: 'blue' },
            { id: 'maintenance', label: '🔧 Start Maintenance', icon: '⚙️', color: 'orange' },
            { id: 'inspect', label: '🔍 Quick Inspection', icon: '👁️', color: 'purple' }
          ];
        case 'checked_out':
          return [
            { id: 'return', label: '↩️ Return Tool', icon: '✅', color: 'green' },
            { id: 'return_maintenance', label: '🔧 Return + Maintenance', icon: '⚙️', color: 'orange' },
            { id: 'extend', label: '⏰ Extend Checkout', icon: '📅', color: 'blue' }
          ];
        case 'maintenance':
          return [
            { id: 'complete', label: '✅ Complete Maintenance', icon: '🎉', color: 'green' },
            { id: 'update_status', label: '📝 Update Progress', icon: '📊', color: 'blue' },
            { id: 'escalate', label: '🚨 Escalate Issue', icon: '⚠️', color: 'red' }
          ];
        default:
          return [];
      }
    };

    const getButtonColor = () => {
      switch(tool.status) {
        case 'available': return 'bg-blue-600 hover:bg-blue-700 border-blue-500';
        case 'checked_out': return 'bg-green-600 hover:bg-green-700 border-green-500';
        case 'maintenance': return 'bg-orange-600 hover:bg-orange-700 border-orange-500';
        default: return 'bg-gray-600 hover:bg-gray-700 border-gray-500';
      }
    };

    const getActionColor = (color) => {
      const colors = {
        blue: 'hover:bg-blue-50 text-blue-700 border-l-blue-500',
        green: 'hover:bg-green-50 text-green-700 border-l-green-500',
        orange: 'hover:bg-orange-50 text-orange-700 border-l-orange-500',
        purple: 'hover:bg-purple-50 text-purple-700 border-l-purple-500',
        red: 'hover:bg-red-50 text-red-700 border-l-red-500'
      };
      return colors[color] || 'hover:bg-gray-50 text-gray-700 border-l-gray-500';
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center space-x-2 shadow-sm ${getButtonColor()}`}
        >
          <span>Actions</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h4 className="font-semibold text-sm text-gray-900 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  {tool.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{tool.serialNumber}</p>
              </div>
              
              <div className="py-2">
                {getActions().map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAction(tool.id, action.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center space-x-3 border-l-4 border-transparent ${getActionColor(action.color)} group`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-150">{action.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.label}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 rotate-[-90deg] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </button>
                ))}
              </div>
              
              {tool.status === 'maintenance' && tool.maintenanceType && (
                <div className="p-3 bg-orange-50 border-t border-orange-200">
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tool.maintenancePriority === 'Critical' ? 'bg-red-100 text-red-800' :
                      tool.maintenancePriority === 'High' ? 'bg-orange-100 text-orange-800' :
                      tool.maintenancePriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {tool.maintenanceType} - {tool.maintenancePriority}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const MaintenanceDropdown = ({ tool, onSelect, isReturnMode = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('Medium');

    const maintenanceOptions = [
      { type: 'routine', label: '🔧 Routine Maintenance', description: 'Regular scheduled maintenance' },
      { type: 'repair', label: '⚠️ Repair Required', description: 'Fix identified issues' },
      { type: 'calibration', label: '📏 Calibration', description: 'Precision adjustment' },
      { type: 'cleaning', label: '🧽 Deep Cleaning', description: 'Thorough cleaning service' },
      { type: 'inspection', label: '🔍 Safety Inspection', description: 'Safety compliance check' },
      { type: 'upgrade', label: '⬆️ Upgrade/Modification', description: 'Performance enhancement' }
    ];

    const priorityLevels = [
      { value: 'Low', color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-500' },
      { value: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-500' },
      { value: 'High', color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-500' },
      { value: 'Critical', color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-500' }
    ];

    const handleSubmit = () => {
      if (selectedType) {
        onSelect(tool.id, selectedType, selectedPriority);
        setIsOpen(false);
        setSelectedType('');
        setSelectedPriority('Medium');
      }
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
        >
          <Wrench className="w-3 h-3" />
          <span>{isReturnMode ? 'Return + Maintenance' : 'Maintenance'}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-sm mb-2 text-gray-900">Select Maintenance Type</h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {maintenanceOptions.map((option) => (
                  <label key={option.type} className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value={option.type}
                      checked={selectedType === option.type}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-sm mb-2 text-gray-900">Priority Level</h4>
              
              <div className="flex space-x-2">
                {priorityLevels.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => setSelectedPriority(priority.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedPriority === priority.value
                        ? `${priority.color} ${priority.bg} ring-2 ${priority.ring}`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {priority.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 flex justify-between space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedType}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isReturnMode ? 'Return & Start Maintenance' : 'Start Maintenance'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const submitCheckout = async () => {
    if (!checkoutForm.employeeName) return;
    
    try {
      await toolService.checkout(selectedTool.id, checkoutForm.employeeName, checkoutForm.notes);
      const response = await toolService.getAll();
      setTools(response.data.results || response.data || []);
      setShowCheckoutModal(false);
      setCheckoutForm({ employeeName: '', notes: '' });
      setSelectedTool(null);
    } catch (error) {
      console.error('Error checking out tool:', error);
      alert('Failed to checkout tool');
    }
  };

  const submitAddTool = async () => {
    if (!addToolForm.name || !addToolForm.category || !addToolForm.serialNumber) return;
    
    const quantity = parseInt(addToolForm.quantity) || 1;
    
    try {
      const toolData = {
        name: addToolForm.name,
        category: addToolForm.category,
        serialNumber: addToolForm.serialNumber,
        status: 'available',
        condition: addToolForm.condition,
        location: 'Tool Room',
        notes: addToolForm.notes || ''
      };
      
      const response = await toolService.create(toolData);
      setTools(prev => [...prev, response.data]);
      setShowAddToolModal(false);
      setAddToolForm({ name: '', category: '', serialNumber: '', condition: 'Good', quantity: 1, notes: '' });
    } catch (error) {
      console.error('Error adding tool:', error);
      alert('Failed to add tool');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysCheckedOut = (checkedOutTime) => {
    if (!checkedOutTime) return 0;
    const now = new Date();
    const checkoutDate = new Date(checkedOutTime);
    const diffTime = Math.abs(now - checkoutDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCheckoutStatus = (days) => {
    if (days === 0) return { color: 'text-green-600', label: 'Today' };
    if (days === 1) return { color: 'text-yellow-600', label: '1 day' };
    if (days <= 3) return { color: 'text-orange-600', label: `${days} days` };
    return { color: 'text-red-600', label: `${days} days (overdue)` };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Hammer className="w-7 h-7 mr-3 text-blue-600" />
            Tools Management
          </h1>
          <p className="text-slate-600 mt-1">Track workshop tools, checkouts, and returns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddToolModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tool
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Tools</p>
              <p className="text-2xl font-bold text-slate-900">{tools.length}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Set(tools.map(t => t.toolGroup || t.id)).size} unique types
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Hammer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{tools.filter(t => t.status === 'available').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Checked Out</p>
              <p className="text-2xl font-bold text-yellow-600">{tools.filter(t => t.status === 'checked_out').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Maintenance</p>
              <p className="text-2xl font-bold text-red-600">{tools.filter(t => t.status === 'maintenance').length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, categories, or serial numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="checked_out">Checked Out</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Tool</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Checked Out By</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Checkout Time</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Days Out</th>
                <th className="text-right py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedTools.map((tool) => {
                const StatusIcon = getStatusIcon(tool.status);
                const daysOut = getDaysCheckedOut(tool.checkedOutTime);
                const checkoutStatus = getCheckoutStatus(daysOut);
                
                return (
                  <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-slate-900">{tool.name}</div>
                          {tool.toolGroup && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              <span className="mr-1">🔧</span>
                              Group: {tool.toolGroup}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{tool.category} • {tool.serialNumber}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tool.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {tool.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {tool.checkedOutBy ? (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="text-slate-900">{tool.checkedOutBy}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-900">{formatTime(tool.checkedOutTime)}</span>
                    </td>
                    <td className="py-4 px-6">
                      {tool.status === 'checked_out' ? (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-slate-400" />
                          <span className={`font-medium ${checkoutStatus.color}`}>
                            {checkoutStatus.label}
                          </span>
                          {daysOut > 3 && <span className="ml-2 text-red-500">⚠️</span>}
                        </div>
                      ) : tool.status === 'maintenance' && tool.maintenanceStarted ? (
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="font-medium text-orange-600">
                              {getDaysCheckedOut(tool.maintenanceStarted) === 0 ? 'Today' : 
                               getDaysCheckedOut(tool.maintenanceStarted) === 1 ? '1 day' : 
                               `${getDaysCheckedOut(tool.maintenanceStarted)} days`} in maintenance
                            </span>
                          </div>
                          {tool.maintenanceType && (
                            <div className="text-xs text-slate-500">
                              Type: {tool.maintenanceType.charAt(0).toUpperCase() + tool.maintenanceType.slice(1)}
                            </div>
                          )}
                        </div>
                      ) : tool.returnedTime ? (
                        <div className="text-sm text-slate-500">
                          <div>Returned: {formatTime(tool.returnedTime)}</div>
                          {tool.lastReturnedBy && <div>By: {tool.lastReturnedBy}</div>}
                        </div>
                      ) : tool.maintenanceCompleted ? (
                        <div className="text-sm text-slate-500">
                          <div>Maintenance completed: {formatTime(tool.maintenanceCompleted)}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {tool.status === 'available' && (
                          <button
                            onClick={() => handleCheckout(tool)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <User className="w-4 h-4" />
                            <span>Assign</span>
                          </button>
                        )}
                        {tool.status === 'checked_out' && (
                          <button
                            onClick={() => handleReturn(tool.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Return</span>
                          </button>
                        )}
                        <ActionDropdown tool={tool} onAction={handleToolAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTools.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Check Out Tool</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTool?.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
                <input
                  type="text"
                  value={checkoutForm.employeeName}
                  onChange={(e) => setCheckoutForm({...checkoutForm, employeeName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employee name"
                />
              </div>
              

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitCheckout}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tool Modal */}
      {showAddToolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Tool</h3>
              <p className="text-sm text-gray-600 mt-1">Register a new tool in the workshop inventory</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name *</label>
                <input
                  type="text"
                  value={addToolForm.name}
                  onChange={(e) => setAddToolForm({...addToolForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Welding Machine - MIG 200A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={addToolForm.category}
                  onChange={(e) => setAddToolForm({...addToolForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Welding Equipment">Welding Equipment</option>
                  <option value="Power Tools">Power Tools</option>
                  <option value="Hand Tools">Hand Tools</option>
                  <option value="Lifting Equipment">Lifting Equipment</option>
                  <option value="Cutting Tools">Cutting Tools</option>
                  <option value="Measuring Tools">Measuring Tools</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number *</label>
                <input
                  type="text"
                  value={addToolForm.serialNumber}
                  onChange={(e) => setAddToolForm({...addToolForm, serialNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., WM-2024-007"
                />
                <p className="text-xs text-gray-500 mt-1">Base serial number (will auto-increment for multiple units)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Quantity *</span>
                  <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {addToolForm.quantity} {addToolForm.quantity === 1 ? 'unit' : 'units'}
                  </span>
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setAddToolForm({...addToolForm, quantity: Math.max(1, parseInt(addToolForm.quantity) - 1)})}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={addToolForm.quantity}
                    onChange={(e) => setAddToolForm({...addToolForm, quantity: e.target.value})}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setAddToolForm({...addToolForm, quantity: Math.max(1, Math.min(50, val))});
                    }}
                    className="flex-1 px-4 py-2 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setAddToolForm({...addToolForm, quantity: Math.min(50, parseInt(addToolForm.quantity) + 1)})}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="mr-1">💡</span>
                  Adding {addToolForm.quantity} {addToolForm.quantity === 1 ? 'tool' : 'identical tools'} with auto-generated serial numbers
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={addToolForm.condition}
                  onChange={(e) => setAddToolForm({...addToolForm, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={addToolForm.notes}
                  onChange={(e) => setAddToolForm({...addToolForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Any additional information about the tool..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowAddToolModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAddTool}
                disabled={!addToolForm.name || !addToolForm.category || !addToolForm.serialNumber}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;