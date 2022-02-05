import {
  Heading,
  HStack,
  useOutsideClick,
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';

import LetterBox from '../atoms/LetterBox';
import { useKeyboard } from '../context/KeyboardContext';

interface HexInputProps {
  onSolve: (answer: string) => void;
  onShuffle: () => void;
  centerLetter: string;
  letters: string[];
}

const HexInput: React.FC<HexInputProps> = ({
  onSolve,
  onShuffle,
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

  const isLongWord = useMemo(() => values.length >= 9, [values]);
  const isLongerWord = useMemo(() => values.length >= 12, [values]);

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
        <HStack
          spacing={1}
          {...(isLongWord
            ? {
                bg: 'purple.500',
                px: 4,
                py: 3,
                borderRadius: 12,
              }
            : {})}
        >
          {values
            .split('')
            .map((value, key) => ({ value, key: `edit-${value}-${key}` }))
            .map(({ value, key }) =>
              isLongWord ? (
                <Heading
                  color={
                    centerLetter === value.toLowerCase()
                      ? 'purple.100'
                      : 'purple.900'
                  }
                  fontSize={[isLongerWord ? 'xl' : '2xl', '3xl']}
                >
                  {value.toUpperCase()}
                </Heading>
              ) : (
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
              )
            )}
        </HStack>
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
            e.preventDefault();
            onSolve(values);
            return;
          }

          if (e.key === 'Tab') {
            e.preventDefault();
            onShuffle();
            return;
          }

          if (
            [
              ...letters,
              centerLetter,
              ...[...letters, centerLetter].map((l) => l.toUpperCase()),
            ].indexOf(e.key) < 0 &&
            e.key !== 'Backspace'
          ) {
            e.preventDefault();
            return;
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        inputMode="none"
      />
    </>
  );
};

export default HexInput;
