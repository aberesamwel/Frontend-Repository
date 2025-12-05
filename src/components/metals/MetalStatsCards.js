import React from 'react';
import { Users, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MetalStatsCards = ({ stats }) => {
  const { getThemeClass } = useTheme();

  const cards = [
    {
      title: "Total Services",
      value: stats.totalServices,
      subtitle: `${stats.completedServices} completed`,
      icon: Users,
      color: 'blue'
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      subtitle: `${stats.completionRate.toFixed(1)}% completion rate`,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: "Outstanding",
      value: `$${stats.outstandingBalance.toFixed(2)}`,
      subtitle: `From ${stats.totalServices - stats.completedServices} active jobs`,
      icon: Clock,
      color: 'orange'
    },
    {
      title: "Avg. Job Value",
      value: `$${stats.averageServiceValue.toFixed(0)}`,
      subtitle: `Total: $${stats.totalRevenue.toFixed(0)}`,
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
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
  );
};

export default MetalStatsCards;