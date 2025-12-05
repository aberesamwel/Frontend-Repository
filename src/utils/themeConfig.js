// Accessibility-focused theme configuration
// Colors chosen for high contrast and visual impairment support

export const themes = {
  light: {
    // Background colors
    bg: {
      primary: 'bg-slate-50',
      secondary: 'bg-white',
      tertiary: 'bg-gray-100',
      card: 'bg-white/95 backdrop-blur-sm',
      hover: 'hover:bg-slate-100',
      active: 'bg-blue-50'
    },
    
    // Text colors (WCAG AA compliant)
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-700',
      tertiary: 'text-slate-600',
      muted: 'text-slate-500',
      inverse: 'text-white'
    },
    
    // Border colors
    border: {
      primary: 'border-slate-200',
      secondary: 'border-slate-300',
      focus: 'border-blue-500'
    },
    
    // Status colors (high contrast)
    status: {
      success: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-amber-100 text-amber-800 border-amber-300',
      error: 'bg-red-100 text-red-800 border-red-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
      neutral: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    
    // Interactive elements
    interactive: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white'
    }
  },
  
  dark: {
    // Background colors
    bg: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      tertiary: 'bg-slate-700',
      card: 'bg-slate-800/95 backdrop-blur-sm',
      hover: 'hover:bg-slate-700',
      active: 'bg-slate-700'
    },
    
    // Text colors (WCAG AA compliant for dark backgrounds)
    text: {
      primary: 'text-white',
      secondary: 'text-slate-200',
      tertiary: 'text-slate-300',
      muted: 'text-slate-400',
      inverse: 'text-slate-900'
    },
    
    // Border colors
    border: {
      primary: 'border-slate-600',
      secondary: 'border-slate-500',
      focus: 'border-blue-400'
    },
    
    // Status colors (high contrast for dark theme)
    status: {
      success: 'bg-green-900/50 text-green-200 border-green-600',
      warning: 'bg-amber-900/50 text-amber-200 border-amber-600',
      error: 'bg-red-900/50 text-red-200 border-red-600',
      info: 'bg-blue-900/50 text-blue-200 border-blue-600',
      neutral: 'bg-slate-700 text-slate-200 border-slate-500'
    },
    
    // Interactive elements
    interactive: {
      primary: 'bg-blue-600 hover:bg-blue-500 text-white',
      secondary: 'bg-slate-600 hover:bg-slate-500 text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      success: 'bg-green-600 hover:bg-green-500 text-white'
    }
  }
};

// Accessibility helpers
export const accessibilityColors = {
  // High contrast colors for better visibility
  highContrast: {
    success: '#059669', // Green-600
    warning: '#D97706', // Amber-600  
    error: '#DC2626',   // Red-600
    info: '#2563EB',    // Blue-600
    focus: '#3B82F6'    // Blue-500
  },
  
  // Color blind friendly palette
  colorBlindSafe: {
    primary: '#1E40AF',   // Blue-800
    secondary: '#059669', // Green-600
    tertiary: '#DC2626',  // Red-600
    quaternary: '#7C2D12' // Orange-900
  }
};

// Theme utility functions
export const getThemeClasses = (theme, category, variant = 'primary') => {
  return themes[theme]?.[category]?.[variant] || '';
};

export const combineThemeClasses = (theme, ...classGroups) => {
  return classGroups
    .map(group => {
      if (typeof group === 'string') return group;
      const [category, variant] = group;
      return getThemeClasses(theme, category, variant);
    })
    .filter(Boolean)
    .join(' ');
};

// Default theme
export const DEFAULT_THEME = 'light';