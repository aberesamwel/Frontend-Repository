import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, X, MoreHorizontal, Search, Settings } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('bodycraft-events');
    return saved ? JSON.parse(saved) : [];
  });
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    type: 'task',
    priority: 'medium',
    reminder: '15'
  });

  const eventTypes = [
    { value: 'task', label: 'Workshop Task', color: 'bg-blue-500' },
    { value: 'meeting', label: 'Client Meeting', color: 'bg-green-500' },
    { value: 'delivery', label: 'Material Delivery', color: 'bg-orange-500' },
    { value: 'inspection', label: 'Quality Inspection', color: 'bg-purple-500' },
    { value: 'maintenance', label: 'Equipment Maintenance', color: 'bg-red-500' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  useEffect(() => {
    localStorage.setItem('bodycraft-events', JSON.stringify(events));
  }, [events]);

  // Check for notifications
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      events.forEach(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const reminderTime = new Date(eventDateTime.getTime() - (parseInt(event.reminder) * 60000));
        
        if (now >= reminderTime && now < eventDateTime && !event.notified) {
          if (Notification.permission === 'granted') {
            new Notification(`Workshop Reminder: ${event.title}`, {
              body: `Starting in ${event.reminder} minutes`,
              icon: '/favicon.ico'
            });
          }
          // Mark as notified
          setEvents(prev => prev.map(e => 
            e.id === event.id ? { ...e, notified: true } : e
          ));
        }
      });
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const addEvent = (e) => {
    e.preventDefault();
    const event = {
      id: Date.now(),
      ...newEvent,
      notified: false,
      createdAt: new Date().toISOString()
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      type: 'task',
      priority: 'medium',
      reminder: '15'
    });
    setIsEventFormOpen(false);
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const getEventTypeColor = (type) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Google Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl text-gray-700 font-normal">Calendar</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-white">
          <div className="p-4">
            <button
              onClick={() => setIsEventFormOpen(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create
            </button>
          </div>
          
          {/* Mini Calendar */}
          <div className="px-4 pb-4">
            <div className="text-sm font-medium text-gray-900 mb-2">{monthYear}</div>
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                return (
                  <button
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`text-xs p-1 rounded hover:bg-blue-100 ${
                      date ? 'text-gray-900' : 'text-gray-300'
                    } ${
                      isToday(date) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                    } ${
                      isSelected(date) ? 'bg-blue-100' : ''
                    }`}
                  >
                    {date ? date.getDate() : ''}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* My Calendars */}
          <div className="px-4">
            <div className="text-sm font-medium text-gray-900 mb-2">My calendars</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 py-1">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <span className="text-sm text-gray-700">Workshop Events</span>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <span className="text-sm text-gray-700">Project Deadlines</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Calendar */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Today
              </button>
              <h2 className="text-xl text-gray-900">{monthYear}</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">Month</button>
              <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">Week</button>
              <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">Day</button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr" style={{ minHeight: 'calc(100vh - 200px)' }}>
              {days.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                      !date ? 'bg-gray-50' : ''
                    } ${
                      isToday(date) ? 'bg-blue-50' : ''
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm mb-2 ${
                          isToday(date) 
                            ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium' 
                            : 'text-gray-900'
                        }`}>
                          {isToday(date) ? date.getDate() : date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate cursor-pointer hover:bg-blue-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle event click
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>



      {/* Google Calendar Style Event Modal */}
      {isEventFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">New Event</h3>
              <button
                onClick={() => setIsEventFormOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={addEvent} className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full text-lg font-medium border-0 border-b border-gray-200 focus:border-blue-500 focus:outline-none pb-2"
                  placeholder="Add title"
                />
              </div>

              <div className="flex items-center space-x-3 py-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex space-x-2">
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                
                <select
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="1440">All day</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEventFormOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;