import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { kpiData } from '../data/mockData';

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
      {kpiData.map((kpi, index) => (
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
                  <span className="text-xs text-slate-500 truncate">vs last month</span>
                </div>
              )}
              
              {kpi.subtitle && (
                <p className="text-xs text-slate-500 mt-1 truncate">{kpi.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;