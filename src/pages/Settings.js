import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Database, Mail, Building, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    company_name: 'Pexsteel',
    company_email: '',
    company_phone: '',
    company_address: '',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_use_tls: true,
    smtp_username: '',
    smtp_password: '',
    low_stock_threshold: 10,
    critical_stock_threshold: 5,
    currency: 'USD',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/v1/settings/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/settings/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const exportAllData = () => {
    // Get all data from localStorage
    const projects = JSON.parse(localStorage.getItem('bodycraft-projects') || '[]');
    const materials = JSON.parse(localStorage.getItem('bodycraft-materials') || '[]');
    const events = JSON.parse(localStorage.getItem('bodycraft-events') || '[]');
    const activities = JSON.parse(localStorage.getItem('bodycraft-activities') || '[]');
    
    const exportData = {
      exportDate: new Date().toISOString(),
      workshop: 'Pexsteel Inventory',
      projects: projects,
      materials: materials,
      events: events,
      activities: activities,
      summary: {
        totalProjects: projects.length,
        totalMaterials: materials.length,
        totalEvents: events.length,
        totalActivities: activities.length
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pexsteel_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('bodycraft-projects');
      localStorage.removeItem('bodycraft-materials');
      localStorage.removeItem('bodycraft-events');
      localStorage.removeItem('bodycraft-activities');
      localStorage.removeItem('bodycraft-project-media');
      localStorage.removeItem('bodycraft-project-updates');
      alert('All data has been cleared successfully.');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage application settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Company Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input 
                type="text" 
                value={settings.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Email</label>
              <input 
                type="email" 
                value={settings.company_email}
                onChange={(e) => handleInputChange('company_email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={settings.company_phone}
                onChange={(e) => handleInputChange('company_phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea 
                value={settings.company_address}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Email Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
              <input 
                type="text" 
                value={settings.smtp_host}
                onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
                <input 
                  type="number" 
                  value={settings.smtp_port}
                  onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={settings.smtp_use_tls}
                    onChange={(e) => handleInputChange('smtp_use_tls', e.target.checked)}
                    className="mr-2" 
                  />
                  <span className="text-sm text-slate-700">Use TLS</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="email" 
                value={settings.smtp_username}
                onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={settings.smtp_password}
                onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                placeholder={settings.smtp_password === '***masked***' ? 'Password is set' : 'Enter password'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>
        
        {/* Inventory Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Inventory Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
              <input 
                type="number" 
                value={settings.low_stock_threshold}
                onChange={(e) => handleInputChange('low_stock_threshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Critical Stock Threshold</label>
              <input 
                type="number" 
                value={settings.critical_stock_threshold}
                onChange={(e) => handleInputChange('critical_stock_threshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select 
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="KES">KES (KSh)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Data Management</h3>
          </div>
          <div className="space-y-4">
            <button 
              onClick={exportAllData}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Export Data
            </button>
            <button 
              onClick={clearAllData}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;