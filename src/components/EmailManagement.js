import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Mail, Shield } from 'lucide-react';
import api from '../services/api';

const EmailManagement = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState({ email: '', description: '' });

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const response = await api.get('/auth/emails');
      setEmails(response.data.emails);
    } catch (error) {
      console.error('Failed to load emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/emails/add', newEmail);
      setNewEmail({ email: '', description: '' });
      setShowAddForm(false);
      loadEmails();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add email');
    }
  };

  const removeEmail = async (emailId) => {
    if (!window.confirm('Are you sure you want to remove this email?')) return;
    
    try {
      await api.delete(`/auth/emails/${emailId}/remove`);
      loadEmails();
    } catch (error) {
      alert('Failed to remove email');
    }
  };

  const toggleEmail = async (emailId) => {
    try {
      await api.patch(`/auth/emails/${emailId}/toggle`);
      loadEmails();
    } catch (error) {
      alert('Failed to toggle email status');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Authorized Emails</h2>
          <p className="text-slate-600">Manage emails authorized for password reset</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Email
        </button>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Authorized Emails ({emails.length})
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {emails.map((email) => (
            <div key={email.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className={`w-5 h-5 ${email.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <div className="font-medium text-slate-900">{email.email}</div>
                  {email.description && (
                    <div className="text-sm text-slate-500">{email.description}</div>
                  )}
                  <div className="text-xs text-slate-400">
                    Added: {new Date(email.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleEmail(email.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    email.is_active 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={email.is_active ? 'Deactivate' : 'Activate'}
                >
                  {email.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => removeEmail(email.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove email"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {emails.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No authorized emails configured
            </div>
          )}
        </div>
      </div>

      {/* Add Email Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Add Authorized Email</h3>
            </div>
            
            <form onSubmit={addEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail.email}
                  onChange={(e) => setNewEmail({...newEmail, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newEmail.description}
                  onChange={(e) => setNewEmail({...newEmail, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Admin email, Support email"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailManagement;