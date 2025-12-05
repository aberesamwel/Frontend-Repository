import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Truck, Wrench, Edit3 } from 'lucide-react';
import { navItems, userProfile } from '../data/mockData';
import ProfileModal from '../shared/ProfileModal';

const Sidebar = ({ sidebarOpen, setSidebarOpen, profile, setProfile }) => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileSave = (updatedProfile) => {
    const newInitials = updatedProfile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    setProfile({...updatedProfile, initials: newInitials});
  };
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 
      w-64 sm:w-72 lg:w-80 xl:w-72
      bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
      backdrop-blur-xl border-r border-slate-700/50 
      transform transition-all duration-500 ease-out 
      lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      shadow-2xl lg:shadow-none
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo Section - Mobile optimized */}
      <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/20">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">Pexsteel</h1>
            <p className="text-xs text-slate-400 font-medium truncate">Workshop Management</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 touch-manipulation"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      {/* Navigation - Mobile optimized */}
      <nav className="mt-4 sm:mt-8 px-3 sm:px-4 flex-1 overflow-y-auto lg:max-h-[calc(100vh-200px)]">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 px-2 sm:px-3">Main Menu</p>
          <ul className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)} // Close mobile menu on navigation
                    className={`relative flex items-center px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 group overflow-hidden touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02] sm:scale-105'
                        : 'text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:text-white hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
                    )}
                    <div className={`relative z-10 flex items-center w-full min-w-0`}>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl mr-3 sm:mr-4 transition-all duration-300 flex-shrink-0 ${
                        isActive ? 'bg-white/20 shadow-lg' : 'bg-slate-600/30 group-hover:bg-slate-500/50'
                      }`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`} />
                      </div>
                      <span className="font-medium tracking-wide truncate">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Bottom Section - Mobile optimized */}
      <div className="p-3 sm:p-4 mt-auto">
        <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-600/50 shadow-2xl group hover:from-slate-600/80 hover:to-slate-500/80 transition-all duration-300 cursor-pointer"
             onClick={() => setIsProfileModalOpen(true)}>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white text-xs sm:text-sm font-bold tracking-wide">{profile.initials}</span>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-700 shadow-sm ${
                profile.status === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate tracking-wide">{profile.name}</p>
              <p className="text-xs text-slate-300 truncate font-medium">{profile.role}</p>
              <div className="flex items-center mt-0.5 sm:mt-1">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                  profile.status === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className={`text-xs font-medium ${
                  profile.status === 'Online' ? 'text-green-400' : 'text-gray-400'
                }`}>{profile.status}</span>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
        
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={profile}
          onSave={handleProfileSave}
        />
      </div>
    </aside>
  );
};

export default Sidebar;