import { BoxProps, useColorMode } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import LetterStatus from '../types/LetterStatus';

interface StyleOptions {
  isDisabled: boolean;
}

const useLetterStatusColor = (): {
  getStyle: (
    status?: LetterStatus,
    options?: Partial<StyleOptions>
  ) => Partial<BoxProps>;
} => {
  const { colorMode } = useColorMode();
  const isDarkMode = useMemo(() => colorMode === 'dark', [colorMode]);

  const getStyle = useCallback(
    (status: LetterStatus, options: StyleOptions) => {
      const { isDisabled } = options || {};
      let bprops = {
        bg: isDarkMode ? 'gray.600' : 'gray.100',
        color: isDarkMode ? 'gray.200' : 'gray.900',
        borderWidth: 1,
        borderColor: isDarkMode ? 'gray.900' : 'gray.50',
      };

      switch (status) {
        case LetterStatus.wrong:
          bprops = {
            ...bprops,
            bg: isDarkMode ? 'gray.700' : 'gray.400',
            color: 'white',
          };
          break;
        case LetterStatus.correct:
          bprops = {
            ...bprops,
            bg: isDarkMode ? 'green.600' : 'green.400',
            color: 'white',
          };
          break;
        case LetterStatus.wrongSpot:
          bprops = {
            ...bprops,
            bg: isDarkMode ? 'orange.600' : 'orange.400',
            color: 'white',
          };
          break;
      }

      if (isDisabled) {
        bprops = {
          ...bprops,
          bg: 'gray.900',
        };
      }

      return bprops;
    },
    [isDarkMode]
  );

  return {
    getStyle,
  };
};

export default useLetterStatusColor;
