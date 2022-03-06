import { extendTheme } from '@chakra-ui/react';

const letterStatusVariants = {
  wrong: ({ colorMode }) => ({
    bg: colorMode === 'dark' ? 'gray.700' : 'gray.400',
    color: 'white',
  }),
  wrongHigh: ({ colorMode }) => ({
    bg: colorMode === 'dark' ? 'gray.700' : 'gray.400',
    color: 'white',
  }),
  correct: ({ colorMode }) => ({
    bg: colorMode === 'dark' ? 'green.600' : 'green.400',
    color: 'white',
  }),
  wrongSpot: ({ colorMode }) => ({
    bg: colorMode === 'dark' ? 'orange.600' : 'orange.400',
    color: 'white',
  }),
  correctHigh: {
    bg: '#0077bb',
    color: 'white',
  },
  wrongSpotHigh: {
    bg: '#ee7733',
    color: 'white',
  },
  disabled: {
    bg: 'gray.900',
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      html: {
        height: '100vh',
        overflowX: 'hidden',
      },
    },
  },
  fonts: {
    heading: `'IBM Plex Sans', sans-serif`,
    body: `'IBM Plex Sans', sans-serif`,
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
    LetterBox: {
      baseStyle: ({ colorMode }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: colorMode === 'dark' ? 'gray.600' : 'gray.100',
        color: colorMode === 'dark' ? 'gray.200' : 'gray.900',
        borderWidth: 1,
        borderColor: colorMode === 'dark' ? 'gray.900' : 'gray.50',
        borderRadius: 4,
      }),
      variants: letterStatusVariants,
    },
    KeyboardKey: {
      baseStyle: ({ colorMode }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: colorMode === 'dark' ? 'gray.600' : 'gray.100',
        color: colorMode === 'dark' ? 'gray.200' : 'gray.900',
        borderWidth: 1,
        borderColor: colorMode === 'dark' ? 'gray.900' : 'gray.50',
        borderRadius: 6,
      }),
      variants: letterStatusVariants,
    },
    Popover: {
      baseStyle: {
        popper: {
          width: 'fit-content',
          maxWidth: 'fit-content',
        },
      },
    },
  },
});

export default theme;
