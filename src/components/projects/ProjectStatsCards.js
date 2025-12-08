import React from 'react';
import { Truck, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProjectStatsCards = ({ projects }) => {
  const { getThemeClass } = useTheme();

  const totalRevenue = projects.reduce((sum, p) => {
    const payment = parseFloat(p.client_payment || p.clientPayment || 0);
    return sum + (isNaN(payment) ? 0 : payment);
  }, 0);
  
  const totalProfit = projects.reduce((sum, p) => {
    const profit = parseFloat(p.profit || 0);
    return sum + (isNaN(profit) ? 0 : profit);
  }, 0);
  
  const stats = {
    activeProjects: projects.filter(p => p.status !== 'completed' && p.status !== 'Completed' && !p.deliveredAt).length,
    totalSales: totalRevenue,
    avgProfitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    pendingDelivery: projects.filter(p => (p.status === 'completed' || p.status === 'Completed') && !p.deliveredAt).length
  };

  const cards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      change: '+8',
      changeType: 'positive',
      icon: Truck,
      subtitle: 'In Progress'
    },
    {
      title: 'Total Sales',
      value: stats.totalSales >= 1000 ? `$${(stats.totalSales / 1000).toFixed(1)}K` : `$${stats.totalSales.toFixed(0)}`,
      change: '+22.5%',
      changeType: 'positive',
      icon: DollarSign,
      subtitle: 'This Month'
    },
    {
      title: 'Profit Margin',
      value: `${stats.avgProfitMargin.toFixed(1)}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      subtitle: 'Average'
    },
    {
      title: 'Pending Delivery',
      value: stats.pendingDelivery,
      change: '-2',
      changeType: 'negative',
      icon: AlertTriangle,
      subtitle: 'Ready for Pickup'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'muted')}`}>{card.title}</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')}`}>{card.value}</p>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                <span className={`text-sm ${getThemeClass('text', 'muted')} ml-2`}>{card.subtitle}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <card.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStatsCards;