import { BoxProps, Box, Heading } from '@chakra-ui/layout';
import { VisuallyHiddenInput } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useState } from 'react';
import { forwardRef } from 'react';

import LetterStatus from '../types/LetterStatus';

interface LetterBoxProps extends Omit<BoxProps, 'onChange'> {
  status?: LetterStatus;
  editable?: boolean;
  onChange?: (e: string) => void;
  value?: string;
  submitOnEnter?: boolean;
}

const LetterBox: React.ForwardRefRenderFunction<any, LetterBoxProps> = (
  {
    status,
    editable,
    children,
    value,
    onChange,
    onFocus,
    onBlur,
    submitOnEnter,
    ...boxProps
  },
  ref
) => {
  const [isFocused, setFocused] = useState(false);

  const bprops = useMemo(() => {
    let bprops = {
      bg: 'gray.100',
      color: 'gray.900',
    };

    switch (status) {
      case LetterStatus.wrong:
        bprops = {
          ...bprops,
          bg: 'gray.400',
          color: 'white',
        };
        break;
      case LetterStatus.correct:
        bprops = {
          ...bprops,
          bg: 'green.400',
          color: 'white',
        };
        break;
      case LetterStatus.wrongSpot:
        bprops = {
          ...bprops,
          bg: 'orange.400',
          color: 'white',
        };
        break;
    }

    if (isFocused) {
      bprops = {
        ...bprops,
        bg: 'blue.100',
      };
    }

    return bprops;
  }, [status, isFocused]);

  return (
    <Box w={12} h={12} pos="relative" {...bprops} {...boxProps}>
      <Heading textAlign="center">{value?.toUpperCase() || children}</Heading>
      {editable && (
        <VisuallyHiddenInput
          ref={ref}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) {
              onFocus(e);
            }
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) {
              onBlur(e);
            }
          }}
          onKeyDown={(e) => {
            if (!e.key.match(/[a-zA-Z]/)) {
              e.preventDefault();
              return;
            }

            if (onChange && (e.key === 'Backspace' || e.key === 'Delete')) {
              onChange('');
            }

            if (e.key === 'Enter') {
              if (submitOnEnter) {
                onChange('SEND');
              }
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (onChange) {
              onChange(
                e.target.value[e.target.value.length - 1]?.toUpperCase()
              );
            }
          }}
          value={value?.toUpperCase()}
          tabIndex={-1}
        />
      )}
    </Box>
  );
};

export default forwardRef(LetterBox);
