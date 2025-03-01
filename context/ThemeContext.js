import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#6366f1',
  secondary: '#4F46E5',
  card: '#F3F4F6',
  border: '#E5E7EB',
  notification: '#FF4500',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  surface: '#FFFFFF',
  accent: '#6366f1',
  subtext: '#6B7280',
};

const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  primary: '#818CF8',
  secondary: '#6366F1',
  card: '#1F2937',
  border: '#374151',
  notification: '#FF6347',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  surface: '#1F2937',
  accent: '#818CF8',
  subtext: '#9CA3AF',
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  // Load theme preference from storage on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    saveThemePreference();
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  // Load theme preference from AsyncStorage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  // Save theme preference to AsyncStorage
  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 