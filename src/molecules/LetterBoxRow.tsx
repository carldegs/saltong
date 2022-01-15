import { HStack } from '@chakra-ui/layout';
import React, { useMemo } from 'react';

import LetterBox from '../atoms/LetterBox';
import { UserGameHistory } from '../types/UserData';
import { getNumArr } from '../utils';

interface LetterBoxRowProps {
  word?: UserGameHistory['word'];
  wordLength: number;
}

const LetterBoxRow: React.FC<LetterBoxRowProps> = ({ word, wordLength }) => {
  const letterListData = useMemo(() => {
    return word?.length
      ? word.map(([letter, status], key) => ({
          letter,
          status,
          key,
        }))
      : getNumArr(wordLength).map((key) => ({
          letter: '',
          status: undefined,
          key,
        }));
  }, [word, wordLength]);

  return (
    <HStack spacing={[2, 3]}>
      {letterListData.map(({ letter, status, key }) => (
        <LetterBox status={status} key={key}>
          {letter}
        </LetterBox>
      ))}
    </HStack>
  );
};

export default LetterBoxRow;
