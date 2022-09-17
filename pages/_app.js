import { ThemeContext } from '@lib/useTheme';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import React, { useCallback, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [colorScheme, setColorScheme] = useState('light');
  const [theme, setTheme] = useState('red-light');

  const toggleColorScheme = useCallback(
    (value) => {
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    },
    [colorScheme]
  );

  useEffect(() => {
    const localThemeJSON = localStorage.getItem('themes');

    try {
      console.log('TRY');
      const localTheme = JSON.parse(localThemeJSON);
      setTheme(localTheme.label);
      toggleColorScheme(localTheme.mode);
      document.body.classList.value =
        'transition-colors ease-in-out duration-200';
      document.body.classList.add(`theme-${localTheme.label}`);
    } catch {
      console.log('ERR');
      const defaultTheme = {
        label: 'red-light',
        mode: 'light',
      };
      localStorage.setItem('themes', JSON.stringify(defaultTheme));
      setTheme(defaultTheme.label);
      toggleColorScheme(defaultTheme.mode);
      document.body.classList.value =
        'transition-colors ease-in-out duration-200';
      document.body.classList.add(`theme-${defaultTheme.label}`);
    }
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <UserContext.Provider value={userData}>
            <NotificationsProvider>
              <ModalsProvider>
                <Component {...pageProps} />
              </ModalsProvider>
            </NotificationsProvider>
          </UserContext.Provider>
        </MantineProvider>
      </ThemeContext.Provider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
