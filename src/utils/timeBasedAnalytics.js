// Time-Based Business Analytics System
// Hierarchical data storage: seconds -> minutes -> hours -> days -> weeks -> months -> years

export class TimeBasedAnalytics {
  constructor() {
    this.storageKey = 'metalworks-analytics';
    this.initializeStorage();
  }

  initializeStorage() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      const initialStructure = {
        metadata: {
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        },
        timeHierarchy: {
          years: {},
          months: {},
          weeks: {},
          days: {},
          hours: {},
          minutes: {},
          seconds: {}
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialStructure));
    }
  }

  // Record business event with precise timestamp
  recordEvent(eventType, data) {
    const timestamp = new Date();
    const analytics = this.getAnalytics();
    
    const timeKeys = {
      year: timestamp.getFullYear(),
      month: `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`,
      week: this.getWeekKey(timestamp),
      day: timestamp.toISOString().split('T')[0],
      hour: `${timestamp.toISOString().split('T')[0]}-${String(timestamp.getHours()).padStart(2, '0')}`,
      minute: `${timestamp.toISOString().split('T')[0]}-${String(timestamp.getHours()).padStart(2, '0')}-${String(timestamp.getMinutes()).padStart(2, '0')}`,
      second: timestamp.toISOString()
    };

    const eventData = {
      timestamp: timestamp.toISOString(),
      type: eventType,
      data: data,
      id: Date.now() + Math.random()
    };

    // Store in all time hierarchies
    Object.entries(timeKeys).forEach(([period, key]) => {
      const periodKey = period === 'year' ? 'years' : period + 's';
      if (!analytics.timeHierarchy[periodKey][key]) {
        analytics.timeHierarchy[periodKey][key] = {
          events: [],
          summary: {
            totalSales: 0,
            totalPayments: 0,
            serviceCount: 0,
            eventCount: 0
          }
        };
      }
      
      analytics.timeHierarchy[periodKey][key].events.push(eventData);
      this.updateSummary(analytics.timeHierarchy[periodKey][key], eventType, data);
    });

    analytics.metadata.lastUpdated = timestamp.toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(analytics));
  }

  updateSummary(periodData, eventType, data) {
    periodData.summary.eventCount++;
    
    switch(eventType) {
      case 'service_created':
        periodData.summary.serviceCount++;
        periodData.summary.totalSales += data.totalAmount || 0;
        break;
      case 'payment_received':
        periodData.summary.totalPayments += data.amount || 0;
        break;
      case 'service_completed':
        // Additional completion tracking can be added here
        break;
    }
  }

  getWeekKey(date) {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  // Get performance data for any time period
  getPerformanceData(period, count = 1) {
    const analytics = this.getAnalytics();
    const now = new Date();
    
    switch(period) {
      case 'last3days':
        return this.getLastNDays(3);
      case 'last7days':
        return this.getLastNDays(7);
      case 'last30days':
        return this.getLastNDays(30);
      case 'thisWeek':
        return this.getCurrentWeek();
      case 'thisMonth':
        return this.getCurrentMonth();
      case 'thisYear':
        return this.getCurrentYear();
      case 'lastNHours':
        return this.getLastNHours(count);
      case 'lastNMinutes':
        return this.getLastNMinutes(count);
      default:
        return null;
    }
  }

  getLastNDays(n) {
    const analytics = this.getAnalytics();
    const days = [];
    const now = new Date();
    
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      
      const dayData = analytics.timeHierarchy.days[dayKey] || {
        events: [],
        summary: { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 }
      };
      
      days.push({
        date: dayKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...dayData.summary
      });
    }
    
    return days;
  }

  getLastNHours(n) {
    const analytics = this.getAnalytics();
    const hours = [];
    const now = new Date();
    
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      const hourKey = `${date.toISOString().split('T')[0]}-${String(date.getHours()).padStart(2, '0')}`;
      
      const hourData = analytics.timeHierarchy.hours[hourKey] || {
        events: [],
        summary: { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 }
      };
      
      hours.push({
        hour: hourKey,
        time: `${String(date.getHours()).padStart(2, '0')}:00`,
        ...hourData.summary
      });
    }
    
    return hours;
  }

  getCurrentWeek() {
    const analytics = this.getAnalytics();
    const now = new Date();
    const weekKey = this.getWeekKey(now);
    
    return analytics.timeHierarchy.weeks[weekKey] || {
      events: [],
      summary: { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 }
    };
  }

  getCurrentMonth() {
    const analytics = this.getAnalytics();
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    return analytics.timeHierarchy.months[monthKey] || {
      events: [],
      summary: { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 }
    };
  }

  getCurrentYear() {
    const analytics = this.getAnalytics();
    const now = new Date();
    const yearKey = now.getFullYear();
    
    return analytics.timeHierarchy.years[yearKey] || {
      events: [],
      summary: { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 }
    };
  }

  // Get detailed analytics summary
  getAnalyticsSummary() {
    const last3Days = this.getLastNDays(3);
    const last7Days = this.getLastNDays(7);
    const last24Hours = this.getLastNHours(24);
    const thisWeek = this.getCurrentWeek();
    const thisMonth = this.getCurrentMonth();
    const thisYear = this.getCurrentYear();

    return {
      last3Days: {
        data: last3Days,
        totals: this.calculateTotals(last3Days)
      },
      last7Days: {
        data: last7Days,
        totals: this.calculateTotals(last7Days)
      },
      last24Hours: {
        data: last24Hours,
        totals: this.calculateTotals(last24Hours)
      },
      thisWeek: {
        data: thisWeek,
        totals: thisWeek.summary
      },
      thisMonth: {
        data: thisMonth,
        totals: thisMonth.summary
      },
      thisYear: {
        data: thisYear,
        totals: thisYear.summary
      }
    };
  }

  calculateTotals(dataArray) {
    return dataArray.reduce((acc, item) => ({
      totalSales: acc.totalSales + (item.totalSales || 0),
      totalPayments: acc.totalPayments + (item.totalPayments || 0),
      serviceCount: acc.serviceCount + (item.serviceCount || 0),
      eventCount: acc.eventCount + (item.eventCount || 0)
    }), { totalSales: 0, totalPayments: 0, serviceCount: 0, eventCount: 0 });
  }

  getAnalytics() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  // Export data for backend sync (ready for API integration)
  exportForBackend() {
    const analytics = this.getAnalytics();
    return {
      ...analytics,
      exportTimestamp: new Date().toISOString(),
      format: 'hierarchical-time-series'
    };
  }

  // Clear old data (optional cleanup)
  cleanupOldData(daysToKeep = 365) {
    const analytics = this.getAnalytics();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    // Remove old daily data
    Object.keys(analytics.timeHierarchy.days).forEach(dayKey => {
      if (new Date(dayKey) < cutoffDate) {
        delete analytics.timeHierarchy.days[dayKey];
      }
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(analytics));
  }
}

// Singleton instance
export const businessAnalytics = new TimeBasedAnalytics();