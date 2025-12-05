import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, DollarSign, Users, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { businessAnalytics } from '../../utils/timeBasedAnalytics';

const BusinessCalendar = () => {
  const { getThemeClass } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const analytics = businessAnalytics.getAnalytics();
    const data = {};

    // Load data for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = analytics.timeHierarchy.days[dateKey] || {
        summary: { totalSales: 0, totalPayments: 0, serviceCount: 0 },
        events: []
      };
      data[dateKey] = dayData.summary;
    }
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
    
    const analytics = businessAnalytics.getAnalytics();
    const dayData = analytics.timeHierarchy.days[selectedDate] || {
      summary: { totalSales: 0, totalPayments: 0, serviceCount: 0 },
      events: []
    };
    
    // Get hourly breakdown for selected date
    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourKey = `${selectedDate}-${String(hour).padStart(2, '0')}`;
      const hourData = analytics.timeHierarchy.hours[hourKey] || {
        summary: { totalSales: 0, totalPayments: 0, serviceCount: 0 }
      };
      hourlyData.push({
        hour,
        time: `${String(hour).padStart(2, '0')}:00`,
        ...hourData.summary
      });
    }
    
    return {
      date: selectedDate,
      summary: dayData.summary,
      events: dayData.events,
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
    <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
      {/* Collapsible Header */}
      <div 
        onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
        className={`flex items-center justify-between p-4 cursor-pointer hover:${getThemeClass('bg', 'hover')} transition-colors border-b ${getThemeClass('border', 'primary')}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getThemeClass('bg', 'primary')} text-blue-600`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>
              Performance Calendar
            </h3>
            <p className={`text-sm ${getThemeClass('text', 'muted')}`}>
              {selectedDate ? `Selected: ${new Date(selectedDate).toLocaleDateString()}` : 'Click to explore daily performance'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {selectedDate && (
            <div className="text-right mr-4">
              <div className={`text-sm font-semibold ${getThemeClass('text', 'primary')}`}>
                ${calendarData[selectedDate]?.totalSales?.toFixed(0) || '0'}
              </div>
              <div className={`text-xs ${getThemeClass('text', 'muted')}`}>
                {calendarData[selectedDate]?.serviceCount || 0} services
              </div>
            </div>
          )}
          {isCalendarExpanded ? (
            <ChevronUp className={`w-5 h-5 ${getThemeClass('text', 'secondary')}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${getThemeClass('text', 'secondary')}`} />
          )}
        </div>
      </div>

      {/* Expandable Calendar Content */}
      <div className={`transition-all duration-300 ease-in-out ${isCalendarExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar */}
            <div className="flex-1">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} hover:${getThemeClass('text', 'primary')}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className={`text-lg font-medium ${getThemeClass('text', 'primary')} min-w-[200px] text-center`}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} hover:${getThemeClass('text', 'primary')}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Today
                </button>
              </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className={`text-center text-sm font-medium ${getThemeClass('text', 'muted')} py-2`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((dayInfo, index) => {
              if (!dayInfo) {
                return <div key={index} className="h-20"></div>;
              }

              const intensity = getDayIntensity(dayInfo.data);
              const hasActivity = dayInfo.data.serviceCount > 0 || dayInfo.data.totalSales > 0;
              const colorClass = getDayColor(intensity, hasActivity);

              return (
                <div
                  key={dayInfo.date}
                  onClick={() => handleDateClick(dayInfo.date)}
                  className={`h-20 p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    dayInfo.isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : dayInfo.isToday 
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : colorClass
                  } ${getThemeClass('border', 'secondary')}`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium ${dayInfo.isToday ? 'text-green-700' : getThemeClass('text', 'primary')}`}>
                      {dayInfo.day}
                    </div>
                    {hasActivity && (
                      <div className="flex-1 flex flex-col justify-center text-xs">
                        <div className="text-green-700 font-semibold">${dayInfo.data.totalSales.toFixed(0)}</div>
                        <div className="text-blue-600">{dayInfo.data.serviceCount} jobs</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-50 border rounded"></div>
              <span className={getThemeClass('text', 'muted')}>No Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className={getThemeClass('text', 'muted')}>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className={getThemeClass('text', 'muted')}>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
              <span className={getThemeClass('text', 'muted')}>Peak Performance 🔥</span>
            </div>
          </div>
            </div>

            {/* Selected Date Details */}
            {selectedDetails && (
              <div className="lg:w-80">
                <div className={`${getThemeClass('bg', 'primary')} rounded-lg p-4 border ${getThemeClass('border', 'secondary')}`}>
                  <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-4`}>
                    {new Date(selectedDetails.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>

                  {/* Daily Summary */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-600">${selectedDetails.summary.totalSales.toFixed(2)}</div>
                      <div className="text-xs text-blue-600">Sales</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">${selectedDetails.summary.totalPayments.toFixed(2)}</div>
                      <div className="text-xs text-green-600">Collected</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-600">{selectedDetails.summary.serviceCount}</div>
                      <div className="text-xs text-purple-600">Services</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-orange-600">{selectedDetails.events.length}</div>
                      <div className="text-xs text-orange-600">Events</div>
                    </div>
                  </div>

                  {/* Hourly Breakdown */}
                  <div>
                    <h5 className={`font-medium ${getThemeClass('text', 'primary')} mb-3`}>Hourly Activity</h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {selectedDetails.hourlyBreakdown
                        .filter(hour => hour.totalSales > 0 || hour.serviceCount > 0)
                        .map(hour => (
                          <div key={hour.hour} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium">{hour.time}</span>
                            <div className="flex space-x-3">
                              <span className="text-green-600">${hour.totalSales.toFixed(0)}</span>
                              <span className="text-blue-600">{hour.serviceCount} jobs</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
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