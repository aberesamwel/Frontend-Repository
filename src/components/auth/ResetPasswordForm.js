import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Password Reset Form Component
 * Handles password reset via email token workflow
 * Professional implementation with security validations
 */
const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if no token provided
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  /**
   * Password strength validation
   * Ensures secure password requirements
   */
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      requirements: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      setError('Password does not meet security requirements');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.resetPassword(token, formData.newPassword);
      
      if (result.message) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(result.error || 'Password reset failed');
      }
    } catch (error) {
      setError(error.message || 'Network error occurred');
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

  const passwordValidation = validatePassword(formData.newPassword);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
          <p className="text-gray-600">
            Your password has been updated successfully. You will be redirected to login in a few seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new secure password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <div className="space-y-1 text-xs">
                <div className={`flex items-center ${passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2">{passwordValidation.requirements.minLength ? '✓' : '✗'}</span>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordValidation.requirements.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2">{passwordValidation.requirements.hasUpper ? '✓' : '✗'}</span>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.requirements.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2">{passwordValidation.requirements.hasLower ? '✓' : '✗'}</span>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.requirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2">{passwordValidation.requirements.hasNumber ? '✓' : '✗'}</span>
                  One number
                </div>
                <div className={`flex items-center ${passwordValidation.requirements.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2">{passwordValidation.requirements.hasSpecial ? '✓' : '✗'}</span>
                  One special character
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;