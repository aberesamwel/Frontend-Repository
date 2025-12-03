// Activity Logger Utility
export const ActivityLogger = {
  // Add new activity to localStorage
  addActivity: (type, message, status = 'info') => {
    const activities = JSON.parse(localStorage.getItem('bodycraft-activities') || '[]');
    
    const newActivity = {
      id: Date.now(),
      type,
      message,
      status,
      time: new Date().toISOString(),
      timeAgo: 'Just now'
    };
    
    // Add to beginning and keep only last 50 activities
    const updatedActivities = [newActivity, ...activities].slice(0, 50);
    localStorage.setItem('bodycraft-activities', JSON.stringify(updatedActivities));
    
    return newActivity;
  },

  // Get all activities
  getActivities: () => {
    const activities = JSON.parse(localStorage.getItem('bodycraft-activities') || '[]');
    
    // Update time ago for each activity
    return activities.map(activity => ({
      ...activity,
      timeAgo: getTimeAgo(activity.time)
    }));
  },

  // Clear all activities
  clearActivities: () => {
    localStorage.removeItem('bodycraft-activities');
  }
};

// Helper function to calculate time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}