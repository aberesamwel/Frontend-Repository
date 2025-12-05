import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MetalStatsCards = ({ stats }) => {
  const { getThemeClass } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = {
    today: {
      title: "Today's Sales",
      sales: stats.dailySales,
      payments: stats.dailyPayments,
      services: stats.dailyServices,
      subtitle: "Daily Performance"
    },
    month: {
      title: "This Month",
      sales: stats.monthlySales,
      payments: stats.monthlyPayments,
      services: stats.monthlyServices,
      subtitle: "Monthly Performance"
    },
    year: {
      title: "This Year",
      sales: stats.yearlySales,
      payments: stats.yearlyPayments,
      services: stats.yearlyServices,
      subtitle: "Yearly Performance"
    },
    total: {
      title: "All Time",
      sales: stats.totalRevenue,
      payments: stats.totalPayments,
      services: stats.totalServices,
      subtitle: "Business Lifetime"
    }
  };

  const currentPeriod = periods[selectedPeriod];
  const collectionRate = currentPeriod.sales > 0 ? (currentPeriod.payments / currentPeriod.sales * 100) : 0;

  const cards = [
    {
      title: "Sales Volume",
      value: `$${currentPeriod.sales.toFixed(2)}`,
      subtitle: `${currentPeriod.services} services • ${currentPeriod.subtitle}`,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: "Cash Collected",
      value: `$${currentPeriod.payments.toFixed(2)}`,
      subtitle: `${collectionRate.toFixed(1)}% collection rate`,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: "Customer Debt",
      value: `$${stats.totalDebt.toFixed(2)}`,
      subtitle: `${stats.pendingServices} pending jobs`,
      icon: Calendar,
      color: 'red'
    },
    {
      title: "Avg. Job Value",
      value: `$${stats.averageJobValue.toFixed(0)}`,
      subtitle: `${stats.completionRate.toFixed(1)}% completion rate`,
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Sales Performance</h3>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`appearance-none ${getThemeClass('bg', 'primary')} ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')} border rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="total">All Time</option>
          </select>
          <ChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${getThemeClass('text', 'muted')} pointer-events-none`} />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div key={index} className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6 transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm ${getThemeClass('text', 'muted')}`}>{card.title}</p>
                <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
                {card.subtitle && (
                  <p className={`text-xs ${getThemeClass('text', 'muted')} mt-1`}>{card.subtitle}</p>
                )}
              </div>
              <div className={`p-3 bg-${card.color}-100 rounded-lg`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetalStatsCards;