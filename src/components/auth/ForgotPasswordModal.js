import React, { useState } from 'react';
import { X, Mail, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: username, 2: recovery question, 3: new password
  const [formData, setFormData] = useState({
    username: '',
    recoveryAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({ username: formData.username });
      setRecoveryQuestion(response.data.recovery_question);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'User not found');
    }
    setLoading(false);
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.verifyRecovery({
        username: formData.username,
        recovery_answer: formData.recoveryAnswer
      });
      setStep(3);
    } catch (error) {
      setError('Incorrect answer. Please try again.');
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword({
        username: formData.username,
        recovery_answer: formData.recoveryAnswer,
        new_password: formData.newPassword
      });
      setSuccess('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      username: '',
      recoveryAnswer: '',
      newPassword: '',
      confirmPassword: ''
    });
    setRecoveryQuestion('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Question
                </label>
                <p className="text-sm text-gray-600 mb-3">{recoveryQuestion}</p>
                <input
                  type="text"
                  required
                  value={formData.recoveryAnswer}
                  onChange={(e) => setFormData({...formData, recoveryAnswer: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your answer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Answer'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;