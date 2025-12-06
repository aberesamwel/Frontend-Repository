/**
 * Clients Component
 * 
 * Purpose: Unified client management page that displays all clients from both
 * truck body building and metal works services in one place.
 * 
 * Features:
 * - Shows clients from both service types with color-coded badges
 * - Filter clients by service type (All, Truck Body, Metal Works)
 * - Search clients by name or phone number
 * - Display total value and profit per client
 * - List recent projects and services for each client
 */

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Truck, Scissors, Filter, Search } from 'lucide-react';

const Clients = ({ projects }) => {
  // State for metal works services loaded from localStorage
  const [metalWorksServices, setMetalWorksServices] = useState([]);
  
  // Filter state: 'all', 'truck', or 'metalworks'
  const [filterType, setFilterType] = useState('all');
  
  // Search term for filtering clients by name or phone
  const [searchTerm, setSearchTerm] = useState('');

  // Load metal works services from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('metalworks-services');
    if (saved) {
      setMetalWorksServices(JSON.parse(saved));
    }
  }, []);

  /**
   * Merge clients from both truck body projects and metal works services
   * Creates a unified client list with service type indicators
   */
  const clients = React.useMemo(() => {
    const clientMap = {};
    
    // Step 1: Add truck body building clients from projects
    projects.forEach(project => {
      if (!clientMap[project.clientName]) {
        clientMap[project.clientName] = {
          name: project.clientName,
          type: 'truck',
          projects: [],
          services: [],
          totalValue: 0,
          totalProfit: 0
        };
      }
      clientMap[project.clientName].projects.push(project);
      clientMap[project.clientName].totalValue += project.clientPayment;
      clientMap[project.clientName].totalProfit += project.profit;
    });
    
    // Step 2: Add metalworks clients from services
    // If client already exists (uses both services), mark as 'both'
    metalWorksServices.forEach(service => {
      if (!clientMap[service.customerName]) {
        clientMap[service.customerName] = {
          name: service.customerName,
          type: 'metalworks',
          phone: service.phone,
          projects: [],
          services: [],
          totalValue: 0,
          totalProfit: 0
        };
      } else if (clientMap[service.customerName].type === 'truck') {
        // Client uses both services
        clientMap[service.customerName].type = 'both';
      }
      
      clientMap[service.customerName].services.push(service);
      clientMap[service.customerName].totalValue += service.totalAmount;
      clientMap[service.customerName].totalProfit += (service.totalAmount * 0.3); // Assume 30% profit margin
    });
    
    return Object.values(clientMap);
  }, [projects, metalWorksServices]);

  /**
   * Filter clients based on:
   * 1. Service type filter (all/truck/metalworks)
   * 2. Search term (name or phone number)
   */
  const filteredClients = clients.filter(client => {
    // Filter by service type
    let matchesType = true;
    if (filterType === 'truck') matchesType = client.type === 'truck' || client.type === 'both';
    if (filterType === 'metalworks') matchesType = client.type === 'metalworks' || client.type === 'both';
    
    // Filter by search term (case-insensitive name or phone match)
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm));
    
    return matchesType && matchesSearch;
  });

  /**
   * Returns color-coded badge based on client service type
   * - Blue badge for truck body clients
   * - Orange badge for metal works clients
   * - Dual badges (blue + orange) for clients using both services
   */
  const getClientBadge = (type) => {
    if (type === 'truck') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <Truck className="w-3 h-3 mr-1" />
          Truck Body
        </span>
      );
    }
    if (type === 'metalworks') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
          <Scissors className="w-3 h-3 mr-1" />
          Metal Works
        </span>
      );
    }
    if (type === 'both') {
      return (
        <div className="flex space-x-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3 mr-1" />
            Truck
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
            <Scissors className="w-3 h-3 mr-1" />
            Metal
          </span>
        </div>
      );
    }
  };

  /**
   * Returns gradient color class for client avatar based on service type
   */
  const getClientGradient = (type) => {
    if (type === 'truck') return 'from-blue-500 to-indigo-600';
    if (type === 'metalworks') return 'from-orange-500 to-red-600';
    if (type === 'both') return 'from-purple-500 to-pink-600';
    return 'from-blue-500 to-purple-600';
  };

  // Calculate statistics for dashboard cards
  const stats = {
    total: clients.length,
    truck: clients.filter(c => c.type === 'truck' || c.type === 'both').length,
    metalworks: clients.filter(c => c.type === 'metalworks' || c.type === 'both').length,
    both: clients.filter(c => c.type === 'both').length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <User className="w-7 h-7 mr-3 text-blue-600" />
          All Clients
        </h1>
        <p className="text-slate-600">Unified client management across all services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600">Total Clients</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="text-sm text-blue-600 flex items-center">
            <Truck className="w-4 h-4 mr-1" />
            Truck Body
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.truck}</div>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-4">
          <div className="text-sm text-orange-600 flex items-center">
            <Scissors className="w-4 h-4 mr-1" />
            Metal Works
          </div>
          <div className="text-2xl font-bold text-orange-700">{stats.metalworks}</div>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-200 p-4">
          <div className="text-sm text-purple-600">Both Services</div>
          <div className="text-2xl font-bold text-purple-700">{stats.both}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-3 mb-6">
        <Filter className="w-5 h-5 text-slate-400" />
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Clients ({stats.total})
        </button>
        <button
          onClick={() => setFilterType('truck')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            filterType === 'truck'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <Truck className="w-4 h-4 mr-2" />
          Truck Body ({stats.truck})
        </button>
        <button
          onClick={() => setFilterType('metalworks')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            filterType === 'metalworks'
              ? 'bg-orange-600 text-white'
              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
          }`}
        >
          <Scissors className="w-4 h-4 mr-2" />
          Metal Works ({stats.metalworks})
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getClientGradient(client.type)} rounded-full flex items-center justify-center`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                  {client.phone && (
                    <p className="text-xs text-slate-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {client.phone}
                    </p>
                  )}
                </div>
              </div>
              {getClientBadge(client.type)}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Value:</span>
                <span className="text-sm font-semibold text-green-600">${client.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Profit:</span>
                <span className="text-sm font-semibold text-blue-600">${client.totalProfit.toLocaleString()}</span>
              </div>
              
              {/* Truck Body Projects */}
              {client.projects.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Truck Projects ({client.projects.length}):
                  </h4>
                  {client.projects.slice(0, 2).map(project => (
                    <div key={project.id} className="text-xs text-slate-500 mb-1 pl-5">
                      • {project.projectId} - {project.vehicleType}
                    </div>
                  ))}
                  {client.projects.length > 2 && (
                    <div className="text-xs text-blue-600 pl-5">+{client.projects.length - 2} more</div>
                  )}
                </div>
              )}
              
              {/* Metal Works Services */}
              {client.services.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                    <Scissors className="w-4 h-4 mr-1" />
                    Metal Services ({client.services.length}):
                  </h4>
                  {client.services.slice(0, 2).map(service => (
                    <div key={service.id} className="text-xs text-slate-500 mb-1 pl-5">
                      • {service.ticketId} - {service.serviceType} (${service.totalAmount})
                    </div>
                  ))}
                  {client.services.length > 2 && (
                    <div className="text-xs text-orange-600 pl-5">+{client.services.length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;