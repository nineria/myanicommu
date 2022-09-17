import ThemeProvider from '@lib/useTheme';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import React, { useCallback, useState } from 'react';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [colorScheme, setColorScheme] = useState('light');

  const toggleColorScheme = useCallback(
    (value) => {
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    },
    [colorScheme]
  );

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <ThemeProvider>
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
      </ThemeProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
