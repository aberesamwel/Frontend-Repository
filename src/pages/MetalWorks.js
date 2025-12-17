/**
 * MetalWorks Component
 * 
 * Purpose: Main page for managing metal works services (cutting, bending, welding, fabrication)
 * 
 * Features:
 * - Create new service tickets with customer info and pricing
 * - Track service status (pending, in progress, completed, picked up)
 * - Manage customer payments and debt tracking
 * - Filter services by status and type
 * - Search services by customer name, ticket ID, or phone
 * - Generate PDF reports with business metrics
 * - Display analytics dashboard with sales performance
 * - Pagination for large service lists
 * 
 * Data Storage: Services are persisted in localStorage under 'metalworks-services'
 */

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
import Pagination from '../components/shared/Pagination';
import { contactsManager } from '../utils/contactsManager';
import { metalWorksService } from '../services/metalWorksService';


const MetalWorks = () => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Load metal works services from API with localStorage fallback
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    loadServices();
  }, []);



  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await metalWorksService.getAll();
      const apiServices = response.data.results || response.data || [];
      setServices(apiServices);
    } catch (error) {
      console.error('Error loading services from API:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };
  
  const [loading, setLoading] = useState(false);

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
    amountPaid: 0,
    paymentMethod: '',
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
    const customerName = service.customer_name || service.customerName || '';
    const ticketId = service.ticket_id || service.ticketId || '';
    const phone = service.phone || '';
    const serviceType = service.service_type || service.serviceType || '';
    
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesService = filterService === 'all' || serviceType.includes(filterService);
    return matchesSearch && matchesStatus && matchesService;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  /**
   * Creates a new service ticket
   * Validates required fields, generates unique ticket ID,
   * calculates payment status, and records analytics events
   */
  const handleAddService = async (serviceData) => {
    // Validate required fields
    if (!serviceData.customerName || !serviceData.phone) {
      alert('Please fill in all required fields: Customer Name and Phone');
      return;
    }
    
    const totalAmount = serviceData.totalAmount || 0;
    const amountPaid = parseFloat(serviceData.amountPaid) || 0;
    
    const servicePayload = {
      service_type: serviceData.serviceType || 'cutting',
      description: `${serviceData.serviceType || 'cutting'} service`,
      customer_name: serviceData.customerName,
      phone: serviceData.phone,
      status: 'pending',
      priority: serviceData.priority || 'standard',
      total_cost: totalAmount,
      notes: serviceData.notes || ''
    };
    
    try {
      await metalWorksService.create(servicePayload);
      // Reload services from backend
      await loadServices();
      
      // Save contact
      contactsManager.saveContact(serviceData.customerName, serviceData.phone, 'metalworks');
      
      setShowServiceModal(false);
      
      // Reset form
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
        amountPaid: 0,
        paymentMethod: '',
        priority: 'standard'
      });
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service. Please try again.');
    }
  };

  /**
   * Updates service work status (pending → in_progress → completed → picked_up)
   * Records completion and pickup events in analytics system
   */
  const handleStatusUpdate = async (serviceId, newStatus) => {
    try {
      await metalWorksService.update(serviceId, { status: newStatus });
      // Reload services from backend
      await loadServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  /**
   * Updates customer payment information
   * Calculates payment status (unpaid/partial/paid)
   * Records payment events in analytics for business intelligence
   */
  const handlePaymentUpdate = async (serviceId, paymentStatus, customAmount = null, paymentMethod = null) => {
    try {
      const updateData = { payment_status: paymentStatus };
      if (customAmount !== null) updateData.amount_paid = parseFloat(customAmount) || 0;
      if (paymentMethod) updateData.payment_method = paymentMethod;
      
      await metalWorksService.update(serviceId, updateData);
      // Reload services from backend
      await loadServices();
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment. Please try again.');
    }
  };

  /**
   * Calculates comprehensive business statistics:
   * - Daily, monthly, yearly sales and payments
   * - Service counts and completion rates
   * - Total revenue, payments, and outstanding debt
   * - Average job value and profit margins
   */
  const getServiceStats = () => {
    const now = new Date();
    const today = now.toDateString();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Daily Sales
    const todayServices = services.filter(s => {
      const dateStr = s.created_at || s.dropOffTime;
      return dateStr && new Date(dateStr).toDateString() === today;
    });
    const dailySales = todayServices.reduce((sum, s) => {
      const amount = parseFloat(s.total_amount || s.totalAmount || 0);
      return sum + amount;
    }, 0);
    const dailyPayments = todayServices.reduce((sum, s) => {
      const paid = parseFloat(s.amount_paid || s.amountPaid || 0);
      return sum + paid;
    }, 0);
    
    // Monthly Sales
    const thisMonthServices = services.filter(s => {
      const dateStr = s.created_at || s.dropOffTime;
      if (!dateStr) return false;
      const serviceDate = new Date(dateStr);
      return serviceDate.getMonth() === thisMonth && serviceDate.getFullYear() === thisYear;
    });
    const monthlySales = thisMonthServices.reduce((sum, s) => {
      const amount = parseFloat(s.total_amount || s.totalAmount || 0);
      return sum + amount;
    }, 0);
    const monthlyPayments = thisMonthServices.reduce((sum, s) => {
      const paid = parseFloat(s.amount_paid || s.amountPaid || 0);
      return sum + paid;
    }, 0);
    
    // Yearly Sales
    const thisYearServices = services.filter(s => {
      const dateStr = s.created_at || s.dropOffTime;
      if (!dateStr) return false;
      const serviceDate = new Date(dateStr);
      return serviceDate.getFullYear() === thisYear;
    });
    const yearlySales = thisYearServices.reduce((sum, s) => {
      const amount = parseFloat(s.total_amount || s.totalAmount || 0);
      return sum + amount;
    }, 0);
    const yearlyPayments = thisYearServices.reduce((sum, s) => {
      const paid = parseFloat(s.amount_paid || s.amountPaid || 0);
      return sum + paid;
    }, 0);
    
    // All-time totals
    const completedServices = services.filter(s => s.status === 'completed');
    const totalRevenue = services.reduce((sum, s) => {
      const amount = parseFloat(s.total_amount || s.totalAmount || 0);
      return sum + amount;
    }, 0);
    const totalPayments = services.reduce((sum, s) => {
      const paid = parseFloat(s.amount_paid || s.amountPaid || 0);
      return sum + paid;
    }, 0);
    const totalDebt = services.reduce((sum, s) => {
      const amount = parseFloat(s.total_amount || s.totalAmount || 0);
      const paid = parseFloat(s.amount_paid || s.amountPaid || 0);
      return sum + Math.max(0, amount - paid);
    }, 0);
    
    // Estimate profit (30% margin on collected payments)
    const PROFIT_MARGIN = 0.30;
    const dailyProfit = dailyPayments * PROFIT_MARGIN;
    const monthlyProfit = monthlyPayments * PROFIT_MARGIN;
    const yearlyProfit = yearlyPayments * PROFIT_MARGIN;
    const totalProfit = totalPayments * PROFIT_MARGIN;
    
    return {
      // Daily metrics
      dailySales,
      dailyPayments,
      dailyServices: todayServices.length,
      dailyProfit,
      
      // Monthly metrics
      monthlySales,
      monthlyPayments,
      monthlyServices: thisMonthServices.length,
      monthlyProfit,
      
      // Yearly metrics
      yearlySales,
      yearlyPayments,
      yearlyServices: thisYearServices.length,
      yearlyProfit,
      
      // Overall business metrics
      totalServices: services.length,
      completedServices: completedServices.length,
      pendingServices: services.filter(s => s.status === 'pending' || s.status === 'in_progress').length,
      totalRevenue,
      totalPayments,
      totalProfit,
      totalDebt,
      outstandingBalance: totalRevenue - totalPayments,
      averageJobValue: services.length > 0 ? totalRevenue / services.length : 0,
      completionRate: services.length > 0 ? (completedServices.length / services.length * 100) : 0,
      profitMargin: PROFIT_MARGIN * 100
    };
  };

  const stats = getServiceStats();

  /**
   * Generates professional PDF report with:
   * - Branded header with company logo
   * - Executive summary with KPI cards
   * - Service details table
   * - Financial analysis section
   * - Branded footer with page numbers
   */
  const generatePDFReport = async () => {
    const jsPDF = (await import('jspdf')).default;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Header with brand colors
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo area
    pdf.setFillColor(59, 130, 246); // blue-500
    pdf.roundedRect(margin, 10, 12, 12, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('MW', margin + 3, 18);
    
    // Company name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pexsteel Metal Works', margin + 20, 18);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Performance Report', margin + 20, 26);
    
    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 18);
    pdf.text(`Document ID: PX-${Date.now()}`, pageWidth - margin - 40, 26);
    
    yPosition = 55;
    
    // Executive Summary
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin, yPosition);
    yPosition += 15;
    
    // KPI Cards
    const kpis = [
      { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: [34, 197, 94] },
      { label: 'Cash Collected', value: `$${stats.totalPayments.toFixed(2)}`, color: [59, 130, 246] },
      { label: 'Outstanding', value: `$${stats.outstandingBalance.toFixed(2)}`, color: [147, 51, 234] },
      { label: 'Completed Jobs', value: stats.completedServices.toString(), color: [249, 115, 22] }
    ];
    
    kpis.forEach((kpi, index) => {
      const x = margin + (index * (contentWidth / 4));
      pdf.setFillColor(...kpi.color);
      pdf.roundedRect(x, yPosition, contentWidth / 4 - 5, 25, 3, 3, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(kpi.value, x + 5, yPosition + 10);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(kpi.label, x + 5, yPosition + 18);
    });
    
    yPosition += 40;
    
    // Service Details Table
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Service Details', margin, yPosition);
    yPosition += 15;
    
    // Table header
    pdf.setFillColor(248, 250, 252); // gray-50
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const headers = ['Ticket ID', 'Customer', 'Service', 'Status', 'Amount', 'Paid'];
    const colWidths = [25, 35, 25, 25, 25, 25];
    let xPos = margin + 2;
    
    headers.forEach((header, index) => {
      pdf.text(header, xPos, yPosition + 7);
      xPos += colWidths[index];
    });

    yPosition += 12;
    
    // Table rows
    const rowsPerPage = 15;
    let currentPageServices = services.slice(0, rowsPerPage);
    
    currentPageServices.forEach((service, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Alternating row colors
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin, yPosition, contentWidth, 8, 'F');
      }
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      xPos = margin + 2;
      const rowData = [
        service.ticketId,
        service.customerName.substring(0, 15),
        service.serviceType.substring(0, 12),
        service.status,
        `$${service.totalAmount.toFixed(2)}`,
        `$${service.amountPaid.toFixed(2)}`
      ];
      
      rowData.forEach((data, colIndex) => {
        pdf.text(data, xPos, yPosition + 6);
        xPos += colWidths[colIndex];
      });
      
      yPosition += 10;
    });
    
    // Financial Summary
    yPosition += 10;
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFillColor(30, 41, 59);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Financial Analysis', margin + 5, yPosition + 6);
    
    yPosition += 15;

    const financialData = [
      ['Total Revenue:', `$${stats.totalRevenue.toFixed(2)}`],
      ['Cash Collected:', `$${stats.totalPayments.toFixed(2)}`],
      ['Outstanding Balance:', `$${stats.outstandingBalance.toFixed(2)}`],
      ['Collection Rate:', `${(stats.totalPayments / stats.totalRevenue * 100).toFixed(1)}%`],
      ['Completion Rate:', `${stats.completionRate.toFixed(1)}%`]
    ];
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    financialData.forEach(([label, value]) => {
      pdf.text(label, margin + 5, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, margin + 80, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 8;
    });
    
    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('Confidential - Pexsteel Metal Works Management System', margin, pageHeight - 8);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 8);
    }
    
    pdf.save(`Pexsteel_MetalWorks_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} flex items-center`}>
            <Scissors className="w-7 h-7 mr-3 text-blue-600" />
            Pexsteel Metal Works
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
      <BusinessCalendar projects={services} />
        


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
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
        <ServiceTable 
          services={paginatedServices}
          onViewDetails={setSelectedService}
          onStatusUpdate={handleStatusUpdate}
          onPaymentUpdate={handlePaymentUpdate}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredServices.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

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