import { BoxProps } from '@chakra-ui/react';

export const DESKTOP_BREAKPOINT = 'lg';

export const hideOnMobile: BoxProps = {
  display: { base: 'none', [DESKTOP_BREAKPOINT]: 'initial' },
};

export const hideOnDesktop: BoxProps = {
  display: { base: 'inherit', [DESKTOP_BREAKPOINT]: 'none' },
};
