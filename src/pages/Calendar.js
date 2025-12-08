import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users, Wrench, Truck, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import BusinessCalendar from '../components/analytics/BusinessCalendar';

const Calendar = ({ projects = [] }) => {
  const { theme, getThemeClass } = useTheme();
  const isDark = theme === 'dark';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Client Meeting - TRK-2024-001',
      date: '2024-12-20',
      time: '10:00 AM',
      type: 'meeting',
      priority: 'high',
      attendees: ['John Smith', 'Sarah Wilson']
    },
    {
      id: 2,
      title: 'Maintenance Due - Welding Machine',
      date: '2024-12-22',
      time: '2:00 PM',
      type: 'maintenance',
      priority: 'medium',
      tool: 'WM-2024-007'
    },
    {
      id: 3,
      title: 'Project Delivery - TRK-2024-003',
      date: '2024-12-25',
      time: '9:00 AM',
      type: 'delivery',
      priority: 'high',
      client: 'Metro Transport'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    priority: 'medium',
    notes: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type, priority) => {
    const colors = {
      meeting: priority === 'high' ? 'bg-blue-500' : 'bg-blue-400',
      maintenance: priority === 'high' ? 'bg-orange-500' : 'bg-orange-400',
      delivery: priority === 'high' ? 'bg-green-500' : 'bg-green-400',
      deadline: 'bg-red-500'
    };
    return colors[type] || 'bg-gray-400';
  };

  const getEventIcon = (type) => {
    const icons = {
      meeting: Users,
      maintenance: Wrench,
      delivery: Truck,
      deadline: Bell
    };
    return icons[type] || CalendarIcon;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border cursor-pointer transition-all duration-200 ${
            isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
          } ${isSelected ? (isDark ? 'bg-blue-900/30 border-blue-500' : 'bg-blue-50 border-blue-300') : ''} ${
            isToday ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : getThemeClass('text', 'primary')
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => {
              const EventIcon = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded text-white truncate flex items-center ${getEventTypeColor(event.type, event.priority)}`}
                >
                  <EventIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className={`text-xs ${getThemeClass('text', 'muted')} font-medium`}>
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const event = {
      id: Date.now(),
      ...newEvent
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: '', date: '', time: '', type: 'meeting', priority: 'medium', notes: '' });
    setShowEventModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} flex items-center`}>
            <CalendarIcon className="w-7 h-7 mr-3 text-blue-600" />
            Calendar & Scheduling
          </h1>
          <p className={`${getThemeClass('text', 'tertiary')} mt-1`}>Manage meetings, deadlines, and maintenance schedules</p>
        </div>
        
        <button 
          onClick={() => setShowEventModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Business Performance Calendar */}
      <BusinessCalendar projects={projects} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
            {/* Calendar Header */}
            <div className={`flex items-center justify-between p-4 ${getThemeClass('border', 'primary')} border-b`}>
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'primary')} hover:${getThemeClass('text', 'secondary')} transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className={`text-xl font-bold ${getThemeClass('text', 'primary')}`}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'primary')} hover:${getThemeClass('text', 'secondary')} transition-colors`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className={`grid grid-cols-7 ${getThemeClass('bg', 'tertiary')}`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={`p-3 text-center text-sm font-semibold ${getThemeClass('text', 'muted')}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-4`}>
            <h3 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
              <Clock className="w-4 h-4 mr-2" />
              Today's Events
            </h3>
            <div className="space-y-2">
              {getEventsForDate(new Date()).length > 0 ? (
                getEventsForDate(new Date()).map(event => {
                  const EventIcon = getEventIcon(event.type);
                  return (
                    <div key={event.id} className={`p-3 rounded-lg ${getThemeClass('bg', 'tertiary')} border-l-4 ${getEventTypeColor(event.type, event.priority).replace('bg-', 'border-')}`}>
                      <div className="flex items-center space-x-2">
                        <EventIcon className="w-4 h-4 text-gray-600" />
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${getThemeClass('text', 'primary')}`}>{event.title}</div>
                          <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{event.time}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={`text-sm ${getThemeClass('text', 'muted')} text-center py-4`}>No events today</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} p-4`}>
            <h3 className={`font-semibold ${getThemeClass('text', 'primary')} mb-3 flex items-center`}>
              <Bell className="w-4 h-4 mr-2" />
              Upcoming
            </h3>
            <div className="space-y-2">
              {events.slice(0, 3).map(event => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div key={event.id} className={`p-2 rounded-lg ${getThemeClass('bg', 'tertiary')}`}>
                    <div className="flex items-center space-x-2">
                      <EventIcon className="w-3 h-3 text-gray-600" />
                      <div className="flex-1">
                        <div className={`font-medium text-xs ${getThemeClass('text', 'primary')}`}>{event.title}</div>
                        <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{event.date} at {event.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-xl w-full max-w-md`}>
            <div className={`p-6 ${getThemeClass('border', 'primary')} border-b`}>
              <h3 className={`text-lg font-semibold ${getThemeClass('text', 'primary')}`}>Add New Event</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="delivery">Delivery</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getThemeClass('text', 'primary')} mb-2`}>Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                    className={`w-full px-3 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className={`p-6 ${getThemeClass('border', 'primary')} border-t flex space-x-3`}>
              <button
                onClick={() => setShowEventModal(false)}
                className={`flex-1 px-4 py-2 border ${getThemeClass('border', 'primary')} ${getThemeClass('text', 'primary')} rounded-lg hover:${getThemeClass('bg', 'hover')} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;