const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_2fa) {
          return { requiresTwoFactor: true, message: data.message };
        }
        
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        // Handle backend error format properly
        let errorMessage = 'Login failed';
        
        if (data.error) {
          // Backend error format: {error: {message, details, status_code}}
          if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (data.error.message) {
            errorMessage = data.error.message;
          } else if (data.error.details) {
            errorMessage = data.error.details;
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  setup2FA: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to setup 2FA');
    }
  },

  verify2FA: async (secret, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret, token }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to verify 2FA');
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to send reset email');
    }
  },

  resetPassword: async (token, new_password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  },

  changePassword: async (current_password, new_password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password/change`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password, new_password }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to change password');
    }
  },

  /**
   * Enhanced logout function with proper token blacklisting
   * Calls backend logout endpoint to invalidate refresh tokens
   * Ensures complete session cleanup for security
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Call backend logout to blacklist the refresh token
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of backend call success
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export { authService };
export default authService;
