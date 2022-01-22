import {
  Heading,
  HStack,
  useOutsideClick,
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LetterBox from '../atoms/LetterBox';
import { useKeyboard } from '../context/KeyboardContext';

interface HexInputProps {
  onSolve: (answer: string) => void;
  centerLetter: string;
  letters: string[];
}

const HexInput: React.FC<HexInputProps> = ({
  onSolve,
  centerLetter,
  letters,
}) => {
  const [values, setValues] = useState('');
  const keyboardRef = useKeyboard();
  const [prevRoute, setPrevRoute] = useState('');
  const route = useRouter();

  useOutsideClick({
    ref: keyboardRef,
    handler: () => keyboardRef.current?.focus(),
  });

  useEffect(() => {
    if ((route.query?.slug as string) || '' !== prevRoute) {
      setValues('');
      if (keyboardRef.current?.value) {
        keyboardRef.current.value = '';
      }
      setPrevRoute((route.query?.slug as string) || '');
    }
  }, [route, prevRoute, keyboardRef]);

  return (
    <>
      <HStack
        spacing={1}
        onClick={() => {
          keyboardRef.current.focus();
        }}
        h="full"
        w="full"
        alignItems="center"
        justifyContent="center"
      >
        {!values.length && (
          <Heading color="purple.300" w="full" textAlign="center">
            Enter Word
          </Heading>
        )}
        {values
          .split('')
          .map((value, key) => ({ value, key: `edit-${key}` }))
          .map(({ value, key }) => (
            <>
              <LetterBox
                bg={
                  centerLetter === value.toLowerCase()
                    ? 'purple.500'
                    : 'purple.200'
                }
                color={
                  centerLetter === value.toLowerCase()
                    ? 'purple.100'
                    : 'purple.900'
                }
                key={key}
                value={value}
              />
            </>
          ))}
      </HStack>

      <VisuallyHiddenInput
        ref={keyboardRef}
        onChange={(e) => {
          setValues(e.target.value?.toLowerCase());
        }}
        onFocus={(e) => {
          if (e.target.value !== values) {
            setValues(e.target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSolve(values);
            return;
          }

          if (
            [...letters, centerLetter].indexOf(e.key) < 0 &&
            e.key !== 'Backspace'
          ) {
            e.preventDefault();
            return;
          }
        }}
        inputMode="none"
      />
    </>
  );
};

export default HexInput;
