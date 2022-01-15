import { useColorMode } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_USER_GAME_DATA,
  DOMAIN,
  NUM_TRIES,
  WORD_LENGTH,
} from '../constants';
import IncompleteWordError from '../lib/errors/IncompleteWordError';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import LetterStatus from '../types/LetterStatus';
import UserData, { UserGameData } from '../types/UserData';
import {
  addAnswer,
  addCorrectAnswer,
  getRoundWithAnswer,
  initialize,
  resetUserData,
  setEndGame,
  solveWord,
} from '../utils';

// TODO: Change to context?
interface UseWordResponse extends UserGameData {
  wordLength: number;
  numTries: number;
  solve: (answer: string) => Promise<UserGameData>;
  resetLocalStorage: () => void;
  getShareStatus: () => string;
  letterStatuses: Record<string, LetterStatus>;
}

const useWord = (gameMode: GameMode): UseWordResponse => {
  const { colorMode } = useColorMode();

  const wordLength = WORD_LENGTH[gameMode];
  const numTries = NUM_TRIES[gameMode];
  // TODO: Remove. Not necessary. Just get from localstorage itself
  const [userData, setUserData] = useState<UserData>({
    main: DEFAULT_USER_GAME_DATA,
    mini: DEFAULT_USER_GAME_DATA,
    max: DEFAULT_USER_GAME_DATA,
    version: '',
  });
  const gameData = userData[gameMode];

  const solve = useCallback(
    async (answer: string) => {
      if (answer.length !== wordLength) {
        throw new IncompleteWordError(wordLength);
      }

      const splitValues = answer.toUpperCase().split('');

      const result = await solveWord(splitValues, gameMode, userData?.uuid);
      let newUserData = addAnswer(result, gameMode);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (!result.find(([_, status]) => status !== LetterStatus.correct)) {
        newUserData = setEndGame(gameMode, true);
      } else if (newUserData[gameMode].history.length === numTries) {
        newUserData = setEndGame(gameMode, false);
      }

      if (newUserData[gameMode].gameStatus !== GameStatus.playing) {
        const { word: correctAnswer } = await getRoundWithAnswer(
          gameMode,
          newUserData[gameMode].gameStatus,
          userData?.uuid
        );

        newUserData = addCorrectAnswer(correctAnswer, gameMode);
      }

      setUserData(newUserData);

      return newUserData[gameMode];
    },
    [gameMode, numTries, userData, wordLength]
  );

  const resetLocalStorage = useCallback(async () => {
    const userData = await resetUserData();

    setUserData(userData);
  }, []);

  const getShareStatus = useCallback(() => {
    const { history, gameId } = gameData;
    const grid = history
      .map(({ word }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const answer = word.map(([_, status]) => status);

        return answer
          .map((letterStatus) => {
            switch (letterStatus) {
              case LetterStatus.correct:
                return '🟩';
              case LetterStatus.wrongSpot:
                return '🟨';
              case LetterStatus.wrong:
                return colorMode === 'dark' ? '⬛' : '⬜';
            }
          })
          .join('');
      })
      .join('\n');

    let gameModeTitle = 'Saltong';

    if (gameMode === GameMode.max) {
      gameModeTitle = 'Saltong Max';
    }

    if (gameMode === GameMode.mini) {
      gameModeTitle = 'Saltong Mini';
    }

    return `${gameModeTitle} ${gameId} (${history.length}/${numTries})
${grid}

${DOMAIN}`;
  }, [gameData, gameMode, numTries, colorMode]);

  const letterStatuses = useMemo(() => {
    const { history } = gameData;

    let statuses: Record<string, LetterStatus> = {};

    history.forEach(({ word }) =>
      word.forEach(([char, status]) => {
        const storedStatus = statuses[char];

        switch (storedStatus) {
          case LetterStatus.correct:
            break;
          case LetterStatus.wrongSpot:
            if (status === LetterStatus.correct) {
              statuses = {
                ...statuses,
                [char]: status,
              };
            }
            break;
          case LetterStatus.wrong:
          default:
            statuses = {
              ...statuses,
              [char]: status,
            };
        }
      })
    );

    return statuses;
  }, [gameData]);

  useEffect(() => {
    const init = async () => {
      const newUserData = await initialize();
      setUserData(newUserData);
    };

    init();
  }, []);

  return {
    wordLength,
    numTries,
    solve,
    resetLocalStorage,
    getShareStatus,
    letterStatuses,
    ...gameData,
  };
};

export default useWord;
