import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DEFAULT_USER_GAME_DATA,
  DOMAIN,
  NUM_TRIES,
  WORD_LENGTH,
} from '../constants';
import IncompleteWordError from '../lib/errors/IncompleteWordError';
import GameMode from '../types/GameMode';
import LetterStatus from '../types/LetterStatus';
import UserData, { UserGameData } from '../types/UserData';
import {
  addAnswer,
  getUserData,
  initialize,
  resetUserData,
  setEndGame,
  solveWord,
} from '../utils';

// TODO: Change to context?
interface UseWordResponse extends UserGameData {
  wordLength: number;
  numTries: number;
  solve: (answer: string) => UserGameData;
  resetLocalStorage: () => void;
  getShareStatus: () => string;
  letterStatuses: Record<string, LetterStatus>;
  gameMode: GameMode;
  firstVisit: boolean;
  setFirstVisit: Dispatch<SetStateAction<boolean>>;
}

const useWord = (): UseWordResponse => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [firstVisit, setFirstVisit] = useState(false);

  const gameMode = useMemo(() => {
    let { slug } = router.query;

    if (!slug) {
      return GameMode.main;
    }

    if (Array.isArray(slug)) {
      router.push('/');
      return GameMode.main;
    }

    slug = (slug as string).toLowerCase();

    if (slug !== GameMode.max && slug !== GameMode.mini) {
      router.push('/');
      return GameMode.main;
    }

    return slug as GameMode;
  }, [router]);

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
    (answer: string) => {
      if (answer.length !== wordLength) {
        throw new IncompleteWordError(wordLength);
      }

      const splitValues = answer.toUpperCase().split('');

      const result = solveWord(splitValues, gameMode);
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
    [gameMode, numTries, wordLength]
  );

  const resetLocalStorage = useCallback(() => {
    const userData = resetUserData();

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
      const initUserData: UserData = getUserData();
      if (!initUserData?.version) {
        setFirstVisit(true);
      }
      const newUserData = initialize();
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
    gameMode,
    firstVisit,
    setFirstVisit,
    ...gameData,
  };
};

export default useWord;
