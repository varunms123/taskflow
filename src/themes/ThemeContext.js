import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { lightColors, darkColors } from './colors';
import { loadTheme, saveTheme } from '../services/storageService';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const saved = await loadTheme();
      if (!active) return;
      if (saved) setIsDark(saved === 'dark');
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, []);

  const setDarkMode = useCallback((value) => {
    setIsDark(value);
    saveTheme(value ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode(!isDark);
  }, [isDark, setDarkMode]);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      setDarkMode,
      toggleTheme,
    }),
    [isDark, setDarkMode, toggleTheme]
  );

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}