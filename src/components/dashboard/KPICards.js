import React from 'react';
import { TrendingUp, TrendingDown, Truck, DollarSign, AlertTriangle } from 'lucide-react';

const KPICards = ({ projects = [] }) => {
  // Calculate dynamic KPI values from actual project data
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const pendingDelivery = projects.filter(p => p.status === 'Completed' && !p.deliveredAt).length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.clientPayment || 0), 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.profit || 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
  
  // Dynamic KPI data
  const dynamicKpiData = [
    { 
      title: 'Active Projects', 
      value: activeProjects.toString(), 
      change: '+8', 
      changeType: 'positive', 
      icon: Truck,
      subtitle: 'In Progress'
    },
    { 
      title: 'Total Sales', 
      value: `$${(totalRevenue/1000).toFixed(0)}K`, 
      change: '+22.5%', 
      changeType: 'positive', 
      icon: DollarSign,
      subtitle: 'This Month'
    },
    { 
      title: 'Profit Margin', 
      value: `${profitMargin}%`, 
      change: '+2.1%', 
      changeType: 'positive', 
      icon: TrendingUp,
      subtitle: 'Average'
    },
    { 
      title: 'Pending Delivery', 
      value: pendingDelivery.toString(), 
      change: pendingDelivery > 5 ? '+2' : '-1', 
      changeType: pendingDelivery > 5 ? 'positive' : 'negative', 
      icon: AlertTriangle,
      subtitle: 'Ready for Pickup'
    }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
      {dynamicKpiData.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                  kpi.changeType === 'positive' ? 'bg-green-100' :
                  kpi.changeType === 'negative' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <kpi.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    kpi.changeType === 'positive' ? 'text-green-600' :
                    kpi.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              
              <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2 truncate">{kpi.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 sm:mb-2 truncate">{kpi.value}</p>
              
              {kpi.change && (
                <div className="flex items-center space-x-1 mb-1">
                  {kpi.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{kpi.subtitle}</span>
                </div>
              )}
              

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;