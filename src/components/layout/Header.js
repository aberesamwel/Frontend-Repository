import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, Plus, Calendar, Clock, X, AlertCircle, Users, Wrench, Sun, Moon, Contrast, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { companyInfo } from '../../config/company';

const Header = ({ setSidebarOpen, searchTerm, setSearchTerm, onAddProject, profile }) => {
  const { currentTheme, toggleTheme, highContrast, toggleHighContrast, getThemeClass, isDark } = useTheme();
  const { logout, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  
  useEffect(() => {
    loadNotifications();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      loadNotifications();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(timer);
  }, []);
  
  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotificationList(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const checkMeetingNotifications = () => {
    if (!profile?.meetings) return;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    profile.meetings.forEach(meeting => {
      if (meeting.date === today) {
        const meetingTime = new Date(`${meeting.date}T${meeting.time}:00`);
        const timeDiff = meetingTime.getTime() - now.getTime();
        const minutesUntil = Math.floor(timeDiff / (1000 * 60));
        
        // Notify 30 minutes before
        if (minutesUntil === 30 || minutesUntil === 15 || minutesUntil === 5) {
          const newNotification = {
            id: Date.now(),
            type: 'meeting',
            title: `Upcoming Meeting: ${meeting.title}`,
            message: `Meeting with ${meeting.client} in ${minutesUntil} minutes`,
            time: now.toISOString(),
            priority: minutesUntil <= 5 ? 'high' : 'medium',
            read: false
          };
          
          setNotificationList(prev => {
            const exists = prev.find(n => n.title === newNotification.title && n.message === newNotification.message);
            return exists ? prev : [newNotification, ...prev];
          });
        }
      }
    });
  };

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotificationList(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'project': return Users;
      case 'service': return Wrench;
      case 'material': return AlertCircle;
      case 'tool': return Wrench;
      case 'payment': return Bell;
      default: return Bell;
    }
  };

  const currentDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className={`sticky top-0 z-50 ${getThemeClass('bg', 'card')} ${getThemeClass('border', 'primary')} border-b h-14 sm:h-16 lg:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-lg relative transition-all duration-300`}>
      {/* Subtle gradient overlay */}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/20 pointer-events-none"></div>
      )}
      
      <div className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8 relative z-10 flex-1 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-slate-100 transition-all duration-200 touch-manipulation flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Title & Clock - Responsive */}
        <div className="hidden sm:block min-w-0 flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-0.5 sm:mb-1">
            <img src="/truck-logo.svg" alt="Truck" className="w-6 h-6 sm:w-7 sm:h-7" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight truncate">{companyInfo.shortName}</h1>
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200 flex-shrink-0">
              <span className="text-xs font-semibold text-green-700">Live</span>
            </div>
            {/* Enhanced Digital Clock */}
            <div className="hidden lg:flex items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl border border-slate-600/30 backdrop-blur-sm relative overflow-hidden">
              {/* Subtle animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 animate-pulse"></div>
              <Clock className="w-5 h-5 mr-3 text-cyan-400 animate-pulse relative z-10" />
              <div className="font-mono text-lg font-bold tracking-widest relative z-10">
                <span className="text-cyan-300 drop-shadow-sm">{timeString.split(':')[0]}</span>
                <span className="text-white animate-pulse mx-1">:</span>
                <span className="text-emerald-300 drop-shadow-sm">{timeString.split(':')[1]}</span>
                <span className="text-white animate-pulse mx-1">:</span>
                <span className="text-amber-300 drop-shadow-sm">{timeString.split(':')[2]}</span>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-sm"></div>
            </div>
          </div>
          <div className="hidden lg:flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium truncate">{currentDate}</span>
          </div>
        </div>
        
        {/* Mobile Search & Clock */}
        <div className="sm:hidden flex items-center space-x-2 flex-1 max-w-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-slate-200 rounded-lg bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 text-sm placeholder:text-slate-400"
            />
          </div>
          {/* Enhanced Mobile Clock */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-2 rounded-xl shadow-lg flex-shrink-0 border border-slate-600/30">
            <div className="font-mono text-sm font-bold tracking-wider">
              <span className="text-cyan-300">{timeString.split(':')[0]}</span>
              <span className="text-white animate-pulse">:</span>
              <span className="text-emerald-300">{timeString.split(':')[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 relative z-10">
        {/* Desktop Search Bar */}
        <div className="relative hidden sm:block">
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects, clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 w-48 sm:w-64 lg:w-96 border border-slate-200 rounded-xl sm:rounded-2xl bg-slate-50/80 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 text-sm font-medium placeholder:text-slate-400 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Smart Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-2.5 lg:p-3 hover:bg-slate-100/80 transition-all duration-200 group touch-manipulation" 
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center font-bold shadow-lg animate-pulse ring-1 sm:ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notificationList.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notificationList.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium text-slate-900 ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(notification.time).toLocaleTimeString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              

            </div>
          )}
        </div>

        {/* Theme Controls */}
        <div className="flex items-center space-x-2">
          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              highContrast 
                ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                : `${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`
            }`}
            title="Toggle High Contrast"
            aria-label="Toggle High Contrast Mode"
          >
            <Contrast className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={`p-2 rounded-lg ${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')} hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2 sm:space-x-3 text-right">
            <div className="hidden sm:block text-right">
              <div className={`text-sm font-semibold ${getThemeClass('text', 'primary')}`}>{user?.username || profile?.name || 'User'}</div>
              <div className={`text-xs ${getThemeClass('text', 'muted')}`}>{profile?.role || 'Manager'}</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg ring-2 ring-white">
              {user?.username?.charAt(0).toUpperCase() || profile?.initials || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;