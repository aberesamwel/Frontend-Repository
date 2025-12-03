import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

const RevenueChart = ({ projects }) => {
  const calculatedData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate current month totals
    const currentMonthProjects = projects.filter(project => {
      const projectDate = new Date(project.startDate);
      return projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear;
    });
    
    const totalRevenue = projects.reduce((sum, project) => sum + project.clientPayment, 0);
    const totalProfit = projects.reduce((sum, project) => sum + project.profit, 0);
    const totalProjects = projects.length;
    
    // Generate monthly data from projects
    const monthlyStats = {};
    projects.forEach(project => {
      const date = new Date(project.startDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthKey, revenue: 0, profit: 0, projects: 0 };
      }
      
      monthlyStats[monthKey].revenue += project.clientPayment;
      monthlyStats[monthKey].profit += project.profit;
      monthlyStats[monthKey].projects += 1;
    });
    
    const chartData = Object.values(monthlyStats);
    
    return {
      totalRevenue,
      totalProfit,
      totalProjects,
      chartData
    };
  }, [projects]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 mb-2">{`${label} 2024`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.dataKey === 'revenue' || entry.dataKey === 'profit' ? '$' + entry.value.toLocaleString() : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
            <p className="text-sm text-slate-500 mt-1">Monthly revenue and profit from vehicle body projects</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              ${(calculatedData.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-slate-500">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{calculatedData.totalProjects}</div>
            <div className="text-xs text-slate-500">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${(calculatedData.totalProfit / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-slate-500">Total Profit</div>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={calculatedData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey="revenue" 
              fill="#3b82f6" 
              name="Revenue ($)"
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
            <Bar 
              dataKey="profit" 
              fill="#10b981" 
              name="Profit ($)"
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center mt-4 p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm text-green-700 font-medium">
            {calculatedData.totalProjects > 0 
              ? `Average profit margin: ${((calculatedData.totalProfit / calculatedData.totalRevenue) * 100).toFixed(1)}%`
              : 'No projects data available'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;