import React, { useEffect } from 'react';

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Set initial theme based on browser preference
    const updateTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    // Set initial theme
    updateTheme();

    // Listen for browser theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return children;
};
