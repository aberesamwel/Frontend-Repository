import React from 'react';
import RevenueChart from '../components/MaintenanceChart';
import { FileText, Download, TrendingUp } from 'lucide-react';

const Reports = ({ projects }) => {
  const totalRevenue = projects.reduce((sum, p) => sum + p.clientPayment, 0);
  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);
  const avgMargin = projects.length > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600">Business performance and financial reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-600">Total Profit</p>
              <p className="text-2xl font-bold text-slate-900">${totalProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-600">Avg Margin</p>
              <p className="text-2xl font-bold text-slate-900">{avgMargin}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <RevenueChart projects={projects} />
    </div>
  );
};

export default Reports;