import React from 'react';
import { Users, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MetalStatsCards = ({ stats }) => {
  const { getThemeClass } = useTheme();

  const cards = [
    {
      title: "Today's Services",
      value: stats.totalServices,
      icon: Users,
      color: 'blue'
    },
    {
      title: "Revenue Today",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: "Completed",
      value: stats.completedServices,
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: "Avg. Service Value",
      value: `$${stats.averageServiceValue.toFixed(0)}`,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>{card.title}</p>
              <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
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