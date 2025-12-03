import React from 'react';
import { Menu, Search, Bell, ChevronDown, Plus, Calendar } from 'lucide-react';

const Header = ({ setSidebarOpen, searchTerm, setSearchTerm, onAddProject }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 h-14 sm:h-16 lg:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/20 pointer-events-none"></div>
      
      <div className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8 relative z-10 flex-1 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-slate-100 transition-all duration-200 touch-manipulation flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Title - Responsive */}
        <div className="hidden sm:block min-w-0 flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-0.5 sm:mb-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight truncate">Workshop Dashboard</h1>
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200 flex-shrink-0">
              <span className="text-xs font-semibold text-green-700">Live</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium truncate">{currentDate}</span>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden flex-1 max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-slate-200 rounded-lg bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 text-sm placeholder:text-slate-400"
            />
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

        {/* Add Project Button - Mobile optimized */}
        <button 
          onClick={onAddProject}
          className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline text-xs sm:text-sm lg:text-base tracking-wide">New Project</span>
          </div>
        </button>
        
        {/* Notifications - Mobile optimized */}
        <div className="relative">
          <button className="relative text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-2.5 lg:p-3 hover:bg-slate-100/80 transition-all duration-200 group touch-manipulation" aria-label="Notifications">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center font-bold shadow-lg animate-pulse ring-1 sm:ring-2 ring-white">3</div>
          </button>
        </div>
        
        {/* User Profile - Mobile optimized */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 pl-2 sm:pl-3 lg:pl-4 border-l border-slate-200/70">
          <div className="text-right hidden md:block">
            <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide truncate">John Doe</p>
            <p className="text-xs text-slate-500 font-medium truncate">Workshop Manager</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 group-hover:ring-blue-300 transition-all duration-300 group-hover:scale-110">
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">JD</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;