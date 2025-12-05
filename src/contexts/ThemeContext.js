import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, DEFAULT_THEME } from '../utils/themeConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('workshop-theme');
    return savedTheme || DEFAULT_THEME;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const savedContrast = localStorage.getItem('workshop-high-contrast');
    return savedContrast === 'true';
  });

  useEffect(() => {
    localStorage.setItem('workshop-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('workshop-high-contrast', highContrast.toString());
  }, [highContrast]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const getThemeClass = (category, variant = 'primary') => {
    return themes[currentTheme]?.[category]?.[variant] || '';
  };

  const value = {
    currentTheme,
    toggleTheme,
    highContrast,
    toggleHighContrast,
    getThemeClass,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};