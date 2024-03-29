'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    sidebarHidden: boolean;
    toggleSidebarVisibility: () => void;
  }
  
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children } : {children: React.ReactNode}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarHidden, setVisibleHidden] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkMode');
    } else {
      document.body.classList.remove('darkMode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const toggleSidebarVisibility = () =>{
    setVisibleHidden((prevMode) => !prevMode);
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, sidebarHidden, toggleSidebarVisibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used with ThemeProvider');
    }
    return context;
};
