import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      html: {
        height: '100vh',
      },
    },
  },
  fonts: {
    heading: 'IBM Plex Sans',
    body: 'IBM Plex Sans',
  },
});

export default theme;
