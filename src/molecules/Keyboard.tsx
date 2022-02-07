import { ChevronLeftIcon } from '@chakra-ui/icons';
import { HStack, Stack, StackProps, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import KeyboardKey, { KeyboardKeyData } from '../atoms/KeyboardKey';
import { useKeyboard } from '../context/KeyboardContext';
import LetterStatus from '../types/LetterStatus';

interface KeyboardProps extends StackProps {
  letterStatuses: Record<string, LetterStatus>;
  onEnter: (string) => void;
  maxLength?: number;
}

const KEYBOARD_LAYOUT = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  ['Enter', ...'zxcvbnm'.split(''), 'Backspace'],
];

const Keyboard: React.FC<KeyboardProps> = ({
  letterStatuses,
  onEnter,
  maxLength,
  ...stackProps
}) => {
  const eventRef = useKeyboard();
  const keyboardInfo: KeyboardKeyData[][] = useMemo(
    () =>
      KEYBOARD_LAYOUT.map((row) =>
        row.map((char) => ({
          value: char,
          label:
            char === 'Backspace' ? (
              <ChevronLeftIcon />
            ) : char === 'Enter' ? (
              '↵'
            ) : (
              char.toUpperCase()
            ),
          status: letterStatuses[char.toUpperCase()],
        }))
      ),
    [letterStatuses]
  );
  const bgGradientColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    eventRef?.current?.focus();
  });

  return (
    <Stack
      spacing={[1, 2]}
      alignItems="center"
      {...stackProps}
      bgGradient={`linear(to-b, transparent, ${bgGradientColor} 5%)`}
      pt={3}
    >
      {keyboardInfo.map((row) => (
        <HStack spacing={[1, 2]} key={`${row[0].value}`}>
          {row.map((data) => (
            <KeyboardKey
              key={`${row[0].value}-${data.value}`}
              onClick={(value) => {
                if (!eventRef.current) {
                  return;
                }

                if (value === 'Enter') {
                  onEnter(eventRef.current.value);
                } else if (value === 'Backspace') {
                  eventRef.current.value = eventRef.current.value.substring(
                    0,
                    eventRef.current.value.length - 1
                  );
                } else if (
                  !maxLength ||
                  (maxLength && eventRef.current.value.length < maxLength)
                ) {
                  eventRef.current.value = `${
                    eventRef.current.value
                  }${value?.toUpperCase()}`;
                }

                eventRef.current.blur();
                eventRef.current.focus();
              }}
              disableDelay={data.value === 'Enter' ? 200 : undefined}
              {...data}
            />
          ))}
        </HStack>
      ))}
    </Stack>
  );
};

export default Keyboard;
