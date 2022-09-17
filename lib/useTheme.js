import { createContext, useContext, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: '',
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
