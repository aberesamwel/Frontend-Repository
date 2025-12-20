import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import authService from '../../services/authService';

const LoginForm = ({ onLogin, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData = {
        username: formData.username,
        password: formData.password
      };
      
      if (requiresTwoFactor && formData.twoFactorCode) {
        loginData.totp_code = formData.twoFactorCode;
      }
      
      const result = await authService.login(loginData);
      
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setError(result.message || 'Please enter your 2FA code');
      } else if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 
                          error?.message || 
                          'Network error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            TruckFlow Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {typeof error === 'string' ? error : 'An error occurred'}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {requiresTwoFactor && (
              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700">
                  Two-Factor Authentication Code
                </label>
                <div className="mt-1 relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    required={requiresTwoFactor}
                    value={formData.twoFactorCode}
                    onChange={handleChange}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;