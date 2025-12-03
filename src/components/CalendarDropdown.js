import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';

const CalendarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('bodycraft-events');
    return saved ? JSON.parse(saved) : [];
  });
  const dropdownRef = useRef(null);

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.date === today.toISOString().split('T')[0]
  );

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-slate-100 transition-all duration-200 group"
        aria-label="Calendar"
      >
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
        {todayEvents.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {todayEvents.length}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Schedule</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Today's Events */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Today ({todayEvents.length})
              </h4>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.map(event => (
                    <div key={event.id} className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No tasks today</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Upcoming</h4>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} at {event.time}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No upcoming tasks</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200">
            <a
              href="/calendar"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Open Full Calendar
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;