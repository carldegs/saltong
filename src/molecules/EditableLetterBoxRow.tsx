import { HStack } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react';

import LetterBox from '../atoms/LetterBox';
import { getNumArr } from '../utils';

interface EditableLetterBoxRowProps {
  wordLength: number;
  onSolve: (answer: string[]) => void;
}

const EditableLetterBoxRow: React.FC<EditableLetterBoxRowProps> = ({
  wordLength,
  onSolve,
}) => {
  const [values, setValues] = useState(getNumArr(wordLength).map(() => ''));
  const boxesRef = useRef<React.RefObject<HTMLInputElement>[]>(
    getNumArr(wordLength).map(() => React.createRef())
  );
  const [numFocus, setNumFocus] = useState(0);

  useEffect(() => {
    if (numFocus <= 0) {
      boxesRef.current[values.indexOf('')].current.focus();
    }
  }, [numFocus, values]);

  return (
    <HStack spacing={4}>
      {values
        .map((value, key) => ({ value, key: `edit-${key}` }))
        .map(({ value, key }, i) => (
          <LetterBox
            key={key}
            ref={boxesRef.current[i]}
            editable
            value={value}
            onChange={(newValue) => {
              if (newValue === '' && i > 0) {
                boxesRef.current[i - 1].current.focus();
              } else if (newValue && i < wordLength - 1) {
                boxesRef.current[i + 1].current.focus();
              }

              if (newValue === 'SEND') {
                if (values.filter((value) => !!value).length === wordLength) {
                  onSolve(values);
                }
                return;
              }

              if (newValue !== undefined) {
                setValues((values) =>
                  Object.assign([], values, { [i]: newValue })
                );
              }
            }}
            onFocus={() => {
              setNumFocus((n) => n + 1);
            }}
            onBlur={() => {
              setNumFocus((n) => n - 1);
            }}
            submitOnEnter={i === wordLength - 1}
          />
        ))}
    </HStack>
  );
};

export default EditableLetterBoxRow;
