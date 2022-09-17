import { useMantineColorScheme } from '@mantine/core';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'red-light',
  setTheme: () => null,
});

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext used outside ThemeContext provider');
  }

  useEffect(() => {
    document.body.classList.value =
      'transition-colors ease-in-out duration-200';
    document.body.classList.add(`theme-${context.theme}`);
  }, [context.theme]);

  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('');

  const { toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const localThemeJSON = localStorage.getItem('themes');

    const localTheme = JSON.parse(localThemeJSON);

    if (!localTheme) {
      const defaultTheme = {
        label: 'red-light',
        mode: 'light',
      };
      localStorage.setItem('themes', JSON.stringify(defaultTheme));
      setTheme(defaultTheme.label);
      toggleColorScheme(defaultTheme.mode);
    } else {
      setTheme(localTheme.label);
      if (localTheme.mode === 'light') toggleColorScheme('light');
      else toggleColorScheme('dark');
    }
  }, [toggleColorScheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
