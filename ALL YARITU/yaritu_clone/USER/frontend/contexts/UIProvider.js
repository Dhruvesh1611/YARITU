'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Create the context
const UIContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useUI = () => useContext(UIContext);

// 3. Create the Provider component
export const UIProvider = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // This effect now centrally manages the body's overflow style
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to reset the style when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // This effect handles the theme class on the body
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme;
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // The value provided to consuming components
  const value = {
    isMenuOpen,
    toggleMenu,
    closeMenu,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
