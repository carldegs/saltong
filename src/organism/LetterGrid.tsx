import { Stack, StackProps } from '@chakra-ui/layout';

import EditableLetterBoxRow from '../molecules/EditableLetterBoxRow';
import LetterBoxRow from '../molecules/LetterBoxRow';
import GameStatus from '../types/GameStatus';
import { UserGameHistory } from '../types/UserData';
import { getNumArr } from '../utils';

interface LetterGridProps extends StackProps {
  numTries: number;
  wordLength: number;
  tries?: UserGameHistory['word'][];
  gameStatus?: GameStatus;
  onSolve: (answer: string) => void;
}

const LetterGrid: React.FC<LetterGridProps> = ({
  numTries,
  wordLength,
  tries,
  onSolve,
  gameStatus = GameStatus.playing,
  ...stackProps
}) => {
  return (
    <Stack spacing={[2, 3]} {...stackProps}>
      {getNumArr(numTries).map((i) =>
        (tries.length <= numTries && tries.length !== i) ||
        gameStatus !== GameStatus.playing ? (
          <LetterBoxRow
            wordLength={wordLength}
            word={i < tries?.length && tries[i]}
            key={i}
          />
        ) : (
          <EditableLetterBoxRow wordLength={wordLength} onSolve={onSolve} />
        )
      )}
    </Stack>
  );
};

export default LetterGrid;
