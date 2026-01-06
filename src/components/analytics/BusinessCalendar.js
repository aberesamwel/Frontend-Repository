import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, DollarSign, Users, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { businessAnalytics } from '../../utils/timeBasedAnalytics';

const BusinessCalendar = ({ projects = [] }) => {
  const { getThemeClass } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const projectsLength = projects.length;

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, projectsLength]);

  const loadCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

    // Initialize all days with zero data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      data[dateKey] = { totalSales: 0, totalPayments: 0, serviceCount: 0 };
    }

    // Aggregate project data by date
    projects.forEach(project => {
      const dateStr = project.createdAt || project.created_at || project.drop_off_time;
      if (!dateStr) return;
      
      const projectDate = new Date(dateStr);
      if (isNaN(projectDate.getTime())) return; // Skip invalid dates
      
      const dateKey = projectDate.toISOString().split('T')[0];
      
      if (data[dateKey]) {
        const payment = parseFloat(project.clientPayment || project.client_payment || project.total_amount || 0);
        const amountPaid = parseFloat(project.amountPaid || project.amount_paid || 0);
        data[dateKey].totalSales += isNaN(payment) ? 0 : payment;
        data[dateKey].totalPayments += isNaN(amountPaid) ? 0 : amountPaid;
        data[dateKey].serviceCount += 1;
      }
    });
    
    setCalendarData(data);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = calendarData[dateKey] || { totalSales: 0, totalPayments: 0, serviceCount: 0 };
      
      days.push({
        day,
        date: dateKey,
        data: dayData,
        isToday: dateKey === new Date().toISOString().split('T')[0],
        isSelected: selectedDate === dateKey
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (dateKey) => {
    setSelectedDate(dateKey);
  };

  const getSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    // Filter projects for selected date
    const dayProjects = projects.filter(project => {
      const dateStr = project.createdAt || project.created_at;
      if (!dateStr) return false;
      
      const projectDate = new Date(dateStr);
      if (isNaN(projectDate.getTime())) return false;
      
      return projectDate.toISOString().split('T')[0] === selectedDate;
    });
    
    const summary = {
      totalSales: dayProjects.reduce((sum, p) => {
        const payment = parseFloat(p.clientPayment || p.client_payment || 0);
        return sum + (isNaN(payment) ? 0 : payment);
      }, 0),
      totalPayments: dayProjects.reduce((sum, p) => {
        const amountPaid = parseFloat(p.amountPaid || p.amount_paid || 0);
        return sum + (isNaN(amountPaid) ? 0 : amountPaid);
      }, 0),
      serviceCount: dayProjects.length
    };
    
    // Get hourly breakdown (simplified - group by creation hour)
    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourProjects = dayProjects.filter(p => {
        const dateStr = p.createdAt || p.created_at;
        if (!dateStr) return false;
        
        const projectDate = new Date(dateStr);
        if (isNaN(projectDate.getTime())) return false;
        
        return projectDate.getHours() === hour;
      });
      
      hourlyData.push({
        hour,
        time: `${String(hour).padStart(2, '0')}:00`,
        totalSales: hourProjects.reduce((sum, p) => {
          const payment = parseFloat(p.clientPayment || p.client_payment || 0);
          return sum + (isNaN(payment) ? 0 : payment);
        }, 0),
        serviceCount: hourProjects.length
      });
    }
    
    return {
      date: selectedDate,
      summary,
      events: dayProjects,
      hourlyBreakdown: hourlyData
    };
  };

  const getDayIntensity = (dayData) => {
    const maxSales = Math.max(...Object.values(calendarData).map(d => d.totalSales || 0));
    if (maxSales === 0) return 0;
    return (dayData.totalSales || 0) / maxSales;
  };

  const getDayColor = (intensity, hasActivity) => {
    if (!hasActivity) return 'bg-gray-50';
    if (intensity > 0.7) return 'bg-green-500';
    if (intensity > 0.4) return 'bg-green-400';
    if (intensity > 0.2) return 'bg-green-300';
    return 'bg-green-200';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedDetails = getSelectedDateDetails();

  return (
    <div className={`${getThemeClass('bg', 'secondary')} rounded-lg sm:rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
      {/* Collapsible Header */}
      <div 
        onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
        className={`flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:${getThemeClass('bg', 'hover')} transition-colors border-b ${getThemeClass('border', 'primary')} touch-manipulation`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className={`p-1.5 sm:p-2 rounded-lg ${getThemeClass('bg', 'primary')} text-blue-600 flex-shrink-0`}>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg font-semibold ${getThemeClass('text', 'primary')} truncate`}>
              Performance Calendar
            </h3>
            <p className={`text-xs sm:text-sm ${getThemeClass('text', 'muted')} truncate`}>
              {selectedDate ? `Selected: ${new Date(selectedDate).toLocaleDateString()}` : 'Tap to explore daily performance'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {selectedDate && (
            <div className="text-right mr-2 sm:mr-4 hidden xs:block">
              <div className={`text-xs sm:text-sm font-semibold ${getThemeClass('text', 'primary')}`}>
                ${calendarData[selectedDate]?.totalSales?.toFixed(0) || '0'}
              </div>
              <div className={`text-xs ${getThemeClass('text', 'muted')}`}>
                {calendarData[selectedDate]?.serviceCount || 0} services
              </div>
            </div>
          )}
          <div className="p-1 sm:p-0">
            {isCalendarExpanded ? (
              <ChevronUp className={`w-4 h-4 sm:w-5 sm:h-5 ${getThemeClass('text', 'secondary')}`} />
            ) : (
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ${getThemeClass('text', 'secondary')}`} />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Calendar Content */}
      <div className={`transition-all duration-300 ease-in-out ${isCalendarExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:gap-6">
            {/* Calendar */}
            <div className="flex-1">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-2 sm:p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} hover:${getThemeClass('text', 'primary')} touch-manipulation`}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className={`text-sm sm:text-lg font-medium ${getThemeClass('text', 'primary')} min-w-[140px] sm:min-w-[200px] text-center`}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-2 sm:p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} hover:${getThemeClass('text', 'primary')} touch-manipulation`}
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors touch-manipulation"
                >
                  Today
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {getDaysInMonth().map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square sm:aspect-auto sm:h-16 lg:h-20 border-r border-b border-gray-200 last:border-r-0"></div>;
                    }
                    
                    const intensity = getDayIntensity(day.data);
                    const hasActivity = day.data.serviceCount > 0;
                    const dayColor = getDayColor(intensity, hasActivity);
                    
                    return (
                      <div
                        key={day.date}
                        onClick={() => handleDateClick(day.date)}
                        className={`aspect-square sm:aspect-auto sm:h-16 lg:h-20 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                          day.isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        } ${day.isToday ? 'bg-blue-100' : dayColor} touch-manipulation`}
                      >
                        <div className="h-full p-1 sm:p-2 flex flex-col justify-between">
                          <div className={`text-xs sm:text-sm font-medium ${
                            day.isToday ? 'text-blue-700' : hasActivity ? 'text-white' : 'text-gray-700'
                          }`}>
                            {day.day}
                          </div>
                          {hasActivity && (
                            <div className="hidden sm:block">
                              <div className={`text-xs font-bold ${
                                hasActivity ? 'text-white' : 'text-gray-600'
                              }`}>
                                ${day.data.totalSales.toFixed(0)}
                              </div>
                              <div className={`text-xs ${
                                hasActivity ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {day.data.serviceCount} svc
                              </div>
                            </div>
                          )}
                          {hasActivity && (
                            <div className="sm:hidden w-1.5 h-1.5 bg-white rounded-full self-end"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Date Details - Mobile: Below calendar, Desktop: Side panel */}
            {selectedDetails && (
              <div className="w-full lg:w-80 xl:w-96">
                <div className={`${getThemeClass('bg', 'primary')} rounded-lg border ${getThemeClass('border', 'primary')} p-3 sm:p-4`}>
                  <h4 className={`text-base sm:text-lg font-semibold ${getThemeClass('text', 'primary')} mb-3 sm:mb-4`}>
                    {new Date(selectedDetails.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  {/* Summary Cards - Mobile: 2x2 grid, Desktop: stacked */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 mb-4">
                    <div className={`${getThemeClass('bg', 'secondary')} rounded-lg p-2 sm:p-3`}>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className={`text-xs sm:text-sm ${getThemeClass('text', 'muted')}`}>Sales</span>
                      </div>
                      <div className={`text-lg sm:text-xl font-bold ${getThemeClass('text', 'primary')}`}>
                        ${selectedDetails.summary.totalSales.toFixed(0)}
                      </div>
                    </div>
                    
                    <div className={`${getThemeClass('bg', 'secondary')} rounded-lg p-2 sm:p-3`}>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className={`text-xs sm:text-sm ${getThemeClass('text', 'muted')}`}>Payments</span>
                      </div>
                      <div className={`text-lg sm:text-xl font-bold ${getThemeClass('text', 'primary')}`}>
                        ${selectedDetails.summary.totalPayments.toFixed(0)}
                      </div>
                    </div>
                    
                    <div className={`${getThemeClass('bg', 'secondary')} rounded-lg p-2 sm:p-3 col-span-2 lg:col-span-1`}>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className={`text-xs sm:text-sm ${getThemeClass('text', 'muted')}`}>Services</span>
                      </div>
                      <div className={`text-lg sm:text-xl font-bold ${getThemeClass('text', 'primary')}`}>
                        {selectedDetails.summary.serviceCount}
                      </div>
                    </div>
                  </div>
                  
                  {/* Events List - Scrollable on mobile */}
                  {selectedDetails.events.length > 0 && (
                    <div>
                      <h5 className={`text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Events</h5>
                      <div className="space-y-2 max-h-32 sm:max-h-40 lg:max-h-60 overflow-y-auto">
                        {selectedDetails.events.slice(0, 5).map((event, index) => (
                          <div key={index} className={`${getThemeClass('bg', 'hover')} rounded p-2 text-xs sm:text-sm`}>
                            <div className={`font-medium ${getThemeClass('text', 'primary')} truncate`}>
                              {event.client_name || event.clientName || 'Unknown Client'}
                            </div>
                            <div className={`${getThemeClass('text', 'muted')} truncate`}>
                              ${parseFloat(event.total_amount || event.clientPayment || 0).toFixed(0)}
                            </div>
                          </div>
                        ))}
                        {selectedDetails.events.length > 5 && (
                          <div className={`text-xs ${getThemeClass('text', 'muted')} text-center py-1`}>
                            +{selectedDetails.events.length - 5} more events
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCalendar;