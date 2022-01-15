import { BoxProps, Heading, Flex } from '@chakra-ui/layout';
import { useMemo } from 'react';
import { forwardRef } from 'react';

import useLetterStatusColor from '../hooks/useLetterStatusColor';
import LetterStatus from '../types/LetterStatus';

interface LetterBoxProps extends Omit<BoxProps, 'onChange'> {
  status?: LetterStatus;
  editable?: boolean;
  onChange?: (e: string) => void;
  value?: string;
  submitOnEnter?: boolean;
}

const LetterBox: React.ForwardRefRenderFunction<any, LetterBoxProps> = ({
  status,
  editable,
  children,
  value,
  onChange,
  onFocus,
  onBlur,
  submitOnEnter,
  ...boxProps
}) => {
  const { getStyle } = useLetterStatusColor();

  const bprops = useMemo(() => {
    return getStyle(status);
  }, [getStyle, status]);

  return (
    <Flex
      w={[10, 12]}
      h={[10, 12]}
      pos="relative"
      borderRadius={4}
      alignItems="center"
      justifyContent="center"
      {...bprops}
      {...boxProps}
    >
      <Heading textAlign="center" fontSize={['2xl', '3xl']}>
        {value?.toUpperCase() || children}
      </Heading>
    </Flex>
  );
};

export default forwardRef(LetterBox);
