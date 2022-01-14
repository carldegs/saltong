import { useColorMode } from '@chakra-ui/react';
import { formatDuration } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_USER_GAME_DATA,
  DOMAIN,
  NUM_TRIES,
  WORD_LENGTH,
} from '../constants';
import GameMode from '../types/GameMode';
import LetterStatus from '../types/LetterStatus';
import UserData, { UserGameData } from '../types/UserData';
import {
  addAnswer,
  getCountdownToNextDay,
  initialize,
  resetUserData,
  setEndGame,
  solveWord,
} from '../utils';

// TODO: Change to context?
interface UseWordResponse extends UserGameData {
  wordLength: number;
  numTries: number;
  solve: (answer: string[]) => Promise<UserGameData>;
  resetLocalStorage: () => void;
  getShareStatus: () => string;
  countdown: Duration;
  countdownText: string;
}

const useWord = (gameMode: GameMode): UseWordResponse => {
  const { colorMode } = useColorMode();

  const wordLength = WORD_LENGTH[gameMode];
  const numTries = NUM_TRIES[gameMode];
  const [userData, setUserData] = useState<UserData>({
    main: DEFAULT_USER_GAME_DATA,
    mini: DEFAULT_USER_GAME_DATA,
    max: DEFAULT_USER_GAME_DATA,
    version: '',
  });
  const gameData = userData[gameMode];
  const [countdown, setCountdown] = useState<Duration>({});

  const solve = useCallback(
    async (answer: string[]) => {
      const { data: result } = await solveWord(answer, gameMode);
      let newUserData = addAnswer(result, gameMode);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (!result.find(([_, status]) => status !== LetterStatus.correct)) {
        newUserData = setEndGame(gameMode, true);
      } else if (newUserData[gameMode].history.length === numTries) {
        newUserData = setEndGame(gameMode, false);
      }

      setUserData(newUserData);

      return newUserData[gameMode];
    },
    [gameMode, numTries]
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

  const countdownText = useMemo(() => formatDuration(countdown), [countdown]);

  useEffect(() => {
    const init = async () => {
      const newUserData = await initialize();
      setUserData(newUserData);
    };

    init();

    const intervalId = setInterval(() => {
      setCountdown(getCountdownToNextDay());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    wordLength,
    numTries,
    solve,
    resetLocalStorage,
    getShareStatus,
    countdown,
    countdownText,
    ...gameData,
  };
};

export default useWord;
