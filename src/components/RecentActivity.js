import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Info, MoreHorizontal } from 'lucide-react';
import { ActivityLogger } from '../utils/activityLogger';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Clear any existing static activities on first load
    const existingActivities = ActivityLogger.getActivities();
    if (existingActivities.length === 0) {
      // Add welcome message on first load
      ActivityLogger.addActivity(
        'system',
        'BodyCraft Pro workshop management system initialized',
        'info'
      );
    }
    
    // Load activities on mount
    setActivities(ActivityLogger.getActivities());
    
    // Update activities every 30 seconds to refresh time ago
    const interval = setInterval(() => {
      setActivities(ActivityLogger.getActivities());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type, status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityBg = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-500 mt-1">Latest project updates and workshop activities</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityBg(activity.status)}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">
                    {activity.message}
                  </p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 text-slate-400 mr-1" />
                    <p className="text-xs text-slate-500">{activity.timeAgo}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent activities</p>
              <p className="text-xs text-slate-400 mt-1">Activities will appear here as you work</p>
            </div>
          )}
        </div>
        
        {activities.length > 6 && (
          <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
            View All {activities.length} Activities
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;