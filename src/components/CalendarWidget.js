import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('bodycraft-events');
    return saved ? JSON.parse(saved) : [];
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickEvent, setQuickEvent] = useState({ title: '', date: '', time: '' });

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.date === today.toISOString().split('T')[0]
  );

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const addQuickEvent = (e) => {
    e.preventDefault();
    if (!quickEvent.title || !quickEvent.date) return;
    
    const event = {
      id: Date.now(),
      ...quickEvent,
      time: quickEvent.time || '09:00',
      type: 'task',
      duration: '60',
      priority: 'medium',
      reminder: '15',
      notified: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem('bodycraft-events', JSON.stringify(updatedEvents));
    
    setQuickEvent({ title: '', date: '', time: '' });
    setShowQuickAdd(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Schedule</h3>
          </div>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Quick Add Form */}
        {showQuickAdd && (
          <form onSubmit={addQuickEvent} className="p-3 bg-slate-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Task title..."
              value={quickEvent.title}
              onChange={(e) => setQuickEvent({...quickEvent, title: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={quickEvent.date}
                onChange={(e) => setQuickEvent({...quickEvent, date: e.target.value})}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="time"
                value={quickEvent.time}
                onChange={(e) => setQuickEvent({...quickEvent, time: e.target.value})}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-sm hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Today's Events */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Today's Tasks</h4>
          {todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No tasks scheduled for today</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Upcoming</h4>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No upcoming tasks</p>
          )}
        </div>

        {/* View Full Calendar Link */}
        <div className="pt-2 border-t border-slate-200">
          <a
            href="/calendar"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View full calendar →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;