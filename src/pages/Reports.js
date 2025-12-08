import React, { useMemo, useState, useRef } from 'react';
import RevenueChart from '../components/MaintenanceChart';
import { FileText, Download, TrendingUp, DollarSign, Users, Calendar, BarChart3, ChevronLeft, ChevronRight, Printer, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';

const Reports = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'document'
  const [projectsPerPage, setProjectsPerPage] = useState(10);
  const reportRef = useRef();
  
  const analytics = useMemo(() => {
    const totalRevenue = projects.reduce((sum, p) => {
      const payment = parseFloat(p.clientPayment || p.client_payment || 0);
      return sum + (isNaN(payment) ? 0 : payment);
    }, 0);
    const totalProfit = projects.reduce((sum, p) => {
      const profit = parseFloat(p.profit || 0);
      return sum + (isNaN(profit) ? 0 : profit);
    }, 0);
    const totalCosts = projects.reduce((sum, p) => {
      const materialCost = parseFloat(p.materialCost || p.material_cost || 0);
      const laborCost = parseFloat(p.laborCost || p.labor_cost || 0);
      return sum + (isNaN(materialCost) ? 0 : materialCost) + (isNaN(laborCost) ? 0 : laborCost);
    }, 0);
    const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'Completed').length;
    const activeProjects = projects.filter(p => p.status === 'welding_phase' || p.status === 'In Progress').length;
    const avgMargin = projects.length > 0 && totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0;
    const avgProjectValue = projects.length > 0 ? (totalRevenue / projects.length / 1000).toFixed(1) : 0;
    
    // Monthly breakdown
    const monthlyData = {};
    projects.forEach(project => {
      const date = new Date(project.startDate || project.start_date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, profit: 0, projects: 0 };
      }
      
      const payment = parseFloat(project.clientPayment || project.client_payment || 0);
      const profit = parseFloat(project.profit || 0);
      monthlyData[monthKey].revenue += isNaN(payment) ? 0 : payment;
      monthlyData[monthKey].profit += isNaN(profit) ? 0 : profit;
      monthlyData[monthKey].projects += 1;
    });
    
    return {
      totalRevenue,
      totalProfit,
      totalCosts,
      completedProjects,
      activeProjects,
      avgMargin,
      avgProjectValue,
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }))
    };
  }, [projects]);

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Pexsteel_Workshop_Report_${new Date().toISOString().split('T')[0]}`,
  });

  const exportToPDF = () => {
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
    pdf.text('PX', margin + 4, 18);
    
    // Company name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pexsteel Workshop', margin + 20, 18);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Performance Report', margin + 20, 26);
    
    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 18);
    pdf.text(`Document ID: RPT-${Date.now()}`, pageWidth - margin - 40, 26);
    
    yPosition = 55;
    
    // Executive Summary
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin, yPosition);
    yPosition += 15;
    
    // KPI Cards
    const kpis = [
      { label: 'Total Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, color: [34, 197, 94] },
      { label: 'Net Profit', value: `$${analytics.totalProfit.toLocaleString()}`, color: [59, 130, 246] },
      { label: 'Profit Margin', value: `${analytics.avgMargin}%`, color: [147, 51, 234] },
      { label: 'Completed Projects', value: analytics.completedProjects.toString(), color: [249, 115, 22] }
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
    
    // Project Details Table
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Details', margin, yPosition);
    yPosition += 15;
    
    // Table header
    pdf.setFillColor(248, 250, 252); // gray-50
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const headers = ['Project ID', 'Client', 'Vehicle', 'Status', 'Revenue', 'Profit'];
    const colWidths = [25, 35, 30, 25, 25, 25];
    let xPos = margin + 2;
    
    headers.forEach((header, index) => {
      pdf.text(header, xPos, yPosition + 7);
      xPos += colWidths[index];
    });
    
    yPosition += 12;
    
    // Table rows with pagination
    const rowsPerPage = 15;
    let currentPageProjects = currentProjects.slice(0, rowsPerPage);
    
    currentPageProjects.forEach((project, index) => {
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
        project.projectId || project.project_id,
        (project.clientName || project.client_name || 'N/A').substring(0, 15),
        (project.vehicleType || project.vehicle_type || 'N/A').substring(0, 12),
        project.status,
        `$${parseFloat(project.clientPayment || project.client_payment || 0).toLocaleString()}`,
        `$${parseFloat(project.profit || 0).toLocaleString()}`
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
      ['Total Revenue:', `$${analytics.totalRevenue.toLocaleString()}`],
      ['Total Costs:', `$${analytics.totalCosts.toLocaleString()}`],
      ['Net Profit:', `$${analytics.totalProfit.toLocaleString()}`],
      ['Profit Margin:', `${analytics.avgMargin}%`],
      ['Completion Rate:', `${((analytics.completedProjects / projects.length) * 100).toFixed(1)}%`]
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
      pdf.text('Confidential - Pexsteel Workshop Management System', margin, pageHeight - 8);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 8);
    }
    
    pdf.save(`Pexsteel_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const reportData = [
      ['Pexsteel Workshop - Performance Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['FINANCIAL SUMMARY'],
      ['Total Sales', `$${analytics.totalRevenue.toLocaleString()}`],
      ['Total Profit', `$${analytics.totalProfit.toLocaleString()}`],
      ['Total Costs', `$${analytics.totalCosts.toLocaleString()}`],
      ['Profit Margin', `${analytics.avgMargin}%`],
      ['Average Project Value', `$${analytics.avgProjectValue}K`],
      [''],
      ['PROJECT BREAKDOWN'],
      ['Project ID', 'Client Name', 'Vehicle Type', 'Status', 'Sales Amount', 'Profit', 'Progress', 'Start Date'],
      ...projects.map(p => [
        p.projectId || p.project_id,
        p.clientName || p.client_name || 'N/A',
        p.vehicleType || p.vehicle_type || 'N/A',
        p.status,
        `$${parseFloat(p.clientPayment || p.client_payment || 0).toLocaleString()}`,
        `$${parseFloat(p.profit || 0).toLocaleString()}`,
        `${p.progress || 0}%`,
        p.startDate || p.start_date
      ]),
      [''],
      ['STATUS SUMMARY'],
      ['Completed Projects', analytics.completedProjects],
      ['Active Projects', analytics.activeProjects],
      ['Total Projects', projects.length]
    ];

    const csvContent = reportData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Pexsteel_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (viewMode === 'document') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Document Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          <button
            onClick={() => setViewMode('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex space-x-3">
            <button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </button>
            <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div ref={reportRef} className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none">
          {/* Document Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pexsteel Workshop</h1>
                <h2 className="text-xl text-gray-700 mb-4">Performance Report</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Report Period: {new Date().toLocaleDateString()}</p>
                  <p>Generated: {new Date().toLocaleString()}</p>
                  <p>Total Projects: {projects.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs text-gray-500">Document ID: RPT-{Date.now()}</p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">${analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">${analytics.totalProfit.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Net Profit</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{analytics.avgMargin}%</p>
                <p className="text-sm text-gray-600">Profit Margin</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{analytics.completedProjects}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Project Details Table */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Project ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Client</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Vehicle</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Revenue</th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold">Profit</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProjects.map((project, index) => (
                    <tr key={project.projectId || project.project_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{project.projectId || project.project_id}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{project.clientName || project.client_name || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{project.vehicleType || project.vehicle_type || 'N/A'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'completed' || project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'welding_phase' || project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-right">${parseFloat(project.clientPayment || project.client_payment || 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-right">${parseFloat(project.profit || 0).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-center">{project.progress || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 print:hidden">
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
                  </p>
                  <select
                    value={projectsPerPage}
                    onChange={(e) => {
                      const newPerPage = parseInt(e.target.value);
                      setProjectsPerPage(newPerPage);
                      setCurrentPage(1);
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page numbers with smart truncation */}
                  {(() => {
                    const pages = [];
                    const showPages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                    let endPage = Math.min(totalPages, startPage + showPages - 1);
                    
                    if (endPage - startPage < showPages - 1) {
                      startPage = Math.max(1, endPage - showPages + 1);
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-2 text-sm border rounded-lg ${
                            currentPage === i
                              ? 'bg-slate-800 text-white border-slate-800'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="px-8 py-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-medium">${analytics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Costs:</span>
                    <span className="font-medium text-red-600">${analytics.totalCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Net Profit:</span>
                    <span className="font-bold text-green-600">${analytics.totalProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span className="font-medium">{analytics.avgMargin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Project Value:</span>
                    <span className="font-medium">${analytics.avgProjectValue}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span className="font-medium">{((analytics.completedProjects / projects.length) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>This report is confidential and proprietary to Pexsteel Workshop Management System</p>
            <p>Generated on {new Date().toLocaleString()} | Page {currentPage} of {totalPages}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Performance & Analytics</h1>
          <p className="text-slate-600">Comprehensive business performance reports</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setViewMode('document')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Document View
          </button>
          <button 
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">+12.5%</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-slate-900">${analytics.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">+8.2%</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-slate-900">${analytics.totalProfit.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">{analytics.completedProjects}/{projects.length}</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.avgMargin}%</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-orange-600 font-medium">AVG</span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Project Value</p>
          <p className="text-2xl font-bold text-slate-900">${analytics.avgProjectValue}K</p>
        </div>
      </div>
      
      {/* Sales Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sales Performance Trends</h3>
              <p className="text-sm text-slate-500 mt-1">Monthly revenue and profit analysis</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm font-medium">Live Data</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <RevenueChart projects={projects} />
        </div>
      </div>
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Completed Projects</span>
              <span className="text-sm font-medium text-green-600">{analytics.completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Active Projects</span>
              <span className="text-sm font-medium text-blue-600">{analytics.activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Projects</span>
              <span className="text-sm font-medium text-slate-900">{projects.length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Revenue</span>
              <span className="text-sm font-medium text-green-600">${analytics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Costs</span>
              <span className="text-sm font-medium text-red-600">${analytics.totalCosts.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Net Profit</span>
              <span className="text-sm font-medium text-slate-900">${analytics.totalProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;