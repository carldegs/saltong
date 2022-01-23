import { HStack } from '@chakra-ui/layout';
import { useOutsideClick, VisuallyHiddenInput } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import LetterBox from '../atoms/LetterBox';
import { useKeyboard } from '../context/KeyboardContext';

interface EditableLetterBoxRowProps {
  wordLength: number;
  onSolve: (answer: string) => void;
}

const EditableLetterBoxRow: React.FC<EditableLetterBoxRowProps> = ({
  wordLength,
  onSolve,
}) => {
  const [values, setValues] = useState('');
  const [isFocused, setFocused] = useState(false);
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

  const splitValues = useMemo(
    () =>
      values
        .split('')
        .concat(new Array(wordLength).fill(''))
        .slice(0, wordLength),
    [wordLength, values]
  );

  return (
    <>
      <HStack
        spacing={[2, 3]}
        onClick={() => {
          keyboardRef.current.focus();
        }}
      >
        {splitValues
          .map((value, key) => ({ value, key: `edit-${key}` }))
          .map(({ value, key }) => (
            <LetterBox
              bg={isFocused ? 'blue.300' : 'blue.200'}
              color="blue.900"
              key={key}
              value={value}
            />
          ))}
      </HStack>

      <VisuallyHiddenInput
        ref={keyboardRef}
        onChange={(e) => {
          setValues(e.target.value?.toUpperCase().substring(0, wordLength));
        }}
        onFocus={(e) => {
          setFocused(true);
          if (e.target.value !== values) {
            setValues(e.target.value);
          }
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onKeyDown={(e) => {
          if (!e.key.match(/[a-zA-Z]/)) {
            e.preventDefault();
            return;
          }

          if (e.key === 'Enter') {
            onSolve(values);
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        inputMode="none"
      />
    </>
  );
};

export default EditableLetterBoxRow;
