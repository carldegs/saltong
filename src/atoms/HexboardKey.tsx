import {
  Box,
  Flex,
  BoxProps,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ReactElement, useMemo } from 'react';

import {
  HEX_BORDER_X,
  HEX_BORDER_Y,
  HEX_HEIGHT,
  HEX_INNER_WIDTH,
  HEX_OUTER_WIDTH,
} from '../constants';

export interface HexboardKeyData {
  value: string;
  label: ReactElement | string;
  isCenterLetter?: boolean;
}

export interface HexboardKeyProps
  extends HexboardKeyData,
    Omit<BoxProps, 'onClick'> {
  onClick: (value: string) => void;
}

const hexBeforeAfterProps = HEX_BORDER_Y.map((hby) => ({
  position: 'absolute',
  height: '0',
  borderTop: `${hby} solid transparent`,
  borderBottom: `${hby} solid transparent`,
}));

const HexboardKey: React.FC<HexboardKeyProps> = ({
  value,
  label,
  isCenterLetter,
  onClick,
  ...boxProps
}) => {
  const size = useBreakpointValue({ base: 0, sm: 1 });
  const hexBeforeProps = useMemo(
    () => ({
      ...hexBeforeAfterProps[size],
      left: ['98%', '100%'],
      borderLeft: `${HEX_BORDER_X[size]} solid var(--chakra-colors-${
        isCenterLetter ? 'purple' : 'gray'
      }-300)`,
    }),
    [isCenterLetter, size]
  );

  const hexAfterProps = useMemo(
    () => ({
      ...hexBeforeAfterProps[size],
      right: ['98%', '100%'],
      width: '0',
      borderRight: `${HEX_BORDER_X[size]} solid var(--chakra-colors-${
        isCenterLetter ? 'purple' : 'gray'
      }-300)`,
    }),
    [isCenterLetter, size]
  );

  return (
    <Box w={HEX_OUTER_WIDTH} h={HEX_HEIGHT} {...boxProps}>
      <Flex
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          onClick(value);
        }}
        bg={isCenterLetter ? 'purple.300' : 'gray.300'}
        h={HEX_HEIGHT}
        w={HEX_INNER_WIDTH}
        mx={HEX_BORDER_X}
        my={0}
        pos="relative"
        _before={{
          content: `""`,
          ...(hexBeforeProps as any),
        }}
        _after={{
          content: `""`,
          ...(hexAfterProps as any),
        }}
        cursor="pointer"
      >
        <Heading
          color={isCenterLetter ? 'purple.900' : 'gray.900'}
          textAlign="center"
          fontSize={['4xl', '5xl']}
        >
          {label}
        </Heading>
      </Flex>
    </Box>
  );
};

export default HexboardKey;
