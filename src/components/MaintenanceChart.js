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
    
    const totalSales = projects.reduce((sum, project) => sum + project.clientPayment, 0);
    const totalProfit = projects.reduce((sum, project) => sum + project.profit, 0);
    const totalProjects = projects.length;
    
    // Generate monthly data from projects
    const monthlyStats = {};
    projects.forEach(project => {
      const date = new Date(project.startDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthKey, sales: 0, profit: 0, projects: 0 };
      }
      
      monthlyStats[monthKey].sales += project.clientPayment;
      monthlyStats[monthKey].profit += project.profit;
      monthlyStats[monthKey].projects += 1;
    });
    
    const chartData = Object.values(monthlyStats);
    
    return {
      totalSales,
      totalProfit,
      totalProjects,
      chartData
    };
  }, [projects]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const salesData = payload.find(p => p.dataKey === 'sales');
      const profitData = payload.find(p => p.dataKey === 'profit');
      const projectsData = payload.find(p => p.dataKey === 'projects');
      
      return (
        <div className="bg-white p-4 border-2 border-blue-500 rounded-xl shadow-2xl min-w-[250px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <p className="font-bold text-slate-900 text-lg">{`${label} 2024`}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {projectsData ? `${projectsData.value} Projects` : ''}
            </span>
          </div>
          
          <div className="space-y-2">
            {salesData && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: salesData.color }}></div>
                  <span className="text-sm font-medium text-slate-700">Total Sales:</span>
                </div>
                <span className="text-sm font-bold" style={{ color: salesData.color }}>
                  ${salesData.value.toLocaleString()}
                </span>
              </div>
            )}
            
            {profitData && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: profitData.color }}></div>
                  <span className="text-sm font-medium text-slate-700">Net Profit:</span>
                </div>
                <span className="text-sm font-bold" style={{ color: profitData.color }}>
                  ${profitData.value.toLocaleString()}
                </span>
              </div>
            )}
            
            {salesData && profitData && (
              <div className="mt-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Profit Margin:</span>
                  <span className="text-xs font-bold text-purple-600">
                    {((profitData.value / salesData.value) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-600">Avg per Project:</span>
                  <span className="text-xs font-bold text-orange-600">
                    ${projectsData ? (salesData.value / projectsData.value).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Sales Overview
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              📊 Monthly revenue and profit analysis • 💰 Track business performance • 📈 Monitor growth trends
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-xs text-blue-600 font-medium mb-1">💵 TOTAL SALES</div>
            <div className="text-2xl font-bold text-blue-700">
              ${(calculatedData.totalSales / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-blue-600 mt-1">Revenue from all projects</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-xs text-green-600 font-medium mb-1">✅ PROJECTS</div>
            <div className="text-2xl font-bold text-green-700">{calculatedData.totalProjects}</div>
            <div className="text-xs text-green-600 mt-1">Completed & in progress</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-xs text-purple-600 font-medium mb-1">💰 NET PROFIT</div>
            <div className="text-2xl font-bold text-purple-700">
              ${(calculatedData.totalProfit / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-purple-600 mt-1">After all expenses</div>
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
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
              label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#475569', fontWeight: 'bold' } }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#475569', fontWeight: 'bold' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#475569', fontWeight: 600, fontSize: '13px' }}>{value}</span>}
            />
            <Bar 
              dataKey="sales" 
              fill="#3b82f6" 
              name="💵 Total Sales"
              radius={[8, 8, 0, 0]}
              barSize={30}
            />
            <Bar 
              dataKey="profit" 
              fill="#10b981" 
              name="💰 Net Profit"
              radius={[8, 8, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Trend Indicator & Legend */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700 font-semibold">
              {calculatedData.totalProjects > 0 
                ? `📊 Average Profit Margin: ${((calculatedData.totalProfit / calculatedData.totalSales) * 100).toFixed(1)}% • Average Project Value: $${(calculatedData.totalSales / calculatedData.totalProjects).toLocaleString(undefined, {maximumFractionDigits: 0})}`
                : '📊 No projects data available'
              }
            </span>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">📖 How to Read This Chart:</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• <span className="font-semibold text-blue-600">Blue bars</span> show total sales revenue for each month</li>
              <li>• <span className="font-semibold text-green-600">Green bars</span> show net profit after expenses</li>
              <li>• Hover over bars to see detailed breakdown including profit margin</li>
              <li>• Higher bars indicate better business performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;