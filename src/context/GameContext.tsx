import { useColorMode } from '@chakra-ui/color-mode';
import { isSameDay } from 'date-fns';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  DEFAULT_USER_DATA,
  DEFAULT_USER_GAME_DATA,
  DOMAIN,
  LOCAL_GAME_DATA,
  LOCAL_KAL_STATUS,
  NUM_TRIES,
  VERSION,
  WORD_LENGTH,
} from '../constants';
import ContextNoProviderError from '../lib/errors/ContextNoProviderError';
import IncompleteWordError from '../lib/errors/IncompleteWordError';
import InvalidWordError from '../lib/errors/InvalidWordError';
import useQueryDictionary from '../queries/useQueryDictionary';
import useQueryRoundData from '../queries/useQueryRoundData';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import LetterStatus from '../types/LetterStatus';
import { RoundData } from '../types/RoundData';
import UserData, { UserGameData } from '../types/UserData';
import { UserGameHistory } from '../types/UserData';
import { getNumArr, getTimeSolved } from '../utils';
import { isSupportedVersion } from '../utils';
import { getPersistState, setPersistState } from '../utils/local';

const getGamePersistState = () => getPersistState<UserData>(LOCAL_GAME_DATA);

const setGamePersistState = (gameState: UserData) =>
  setPersistState<UserData>(LOCAL_GAME_DATA, gameState);

export interface OnShareOptions {
  showTimeSolved: boolean;
  showLink: boolean;
}

interface useGameProps extends UserGameData {
  firstVisit: boolean;
  setFirstVisit: Dispatch<SetStateAction<boolean>>;
  solve: (answer: string) => UserGameData;
  resetLocalStorage: () => void;
  getShareStatus: (options?: Partial<OnShareOptions>) => string;
  letterStatuses: Record<string, LetterStatus>;
  gameMode: GameMode;
  timeSolved?: string;
  wordLength: number;
  numTries: number;
  isLoading: boolean;
  isError: boolean;
  fetchError?: ApiError;
}

const DEFAULT_DATA: useGameProps = {
  ...DEFAULT_USER_GAME_DATA,
  firstVisit: false,
  setFirstVisit: null,
  solve: () => undefined,
  resetLocalStorage: () => undefined,
  getShareStatus: () => '',
  letterStatuses: {},
  gameMode: undefined,
  timeSolved: '',
  wordLength: 0,
  numTries: 0,
  isLoading: false,
  isError: false,
  fetchError: undefined,
};

const GameContext = createContext<useGameProps>(DEFAULT_DATA);

export const useGame = () => {
  const game = useContext(GameContext);

  if (!game) {
    throw new ContextNoProviderError('useHexGame', 'HexGameProvider');
  }

  return game;
};

export const GameProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const gameMode = useMemo(() => {
    let { slug } = router.query;

    if (!slug && router.route !== '/kal') {
      return GameMode.main;
    }

    if (Array.isArray(slug)) {
      router.push('/');
      return GameMode.main;
    }

    slug = ((slug as string) || router.route.replace('/', '')).toLowerCase();

    if (
      slug !== GameMode.max &&
      slug !== GameMode.mini &&
      slug !== GameMode.kal
    ) {
      router.push('/');
      return GameMode.main;
    }

    return slug as GameMode;
  }, [router]);
  const { data: roundData, ...roundQueryData } = useQueryRoundData(gameMode);
  const { data: dict, ...dictQueryData } = useQueryDictionary();
  const isLoading = useMemo(
    () => roundQueryData.isLoading || dictQueryData.isLoading,
    [dictQueryData.isLoading, roundQueryData.isLoading]
  );
  const isError = useMemo(
    () => roundQueryData.isError || dictQueryData.isError,
    [dictQueryData.isError, roundQueryData.isError]
  );
  const fetchError = useMemo(
    () => roundQueryData.error || dictQueryData.error,
    [dictQueryData.error, roundQueryData.error]
  );
  const { colorMode } = useColorMode();
  const [state, setState] = useState(DEFAULT_USER_DATA);
  const gameData = useMemo(
    () =>
      (state[gameMode] as UserGameData | undefined) || DEFAULT_USER_GAME_DATA,
    [gameMode, state]
  );
  const [firstVisit, setFirstVisit] = useState(false);

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
  const timeSolved = useMemo(
    () => getTimeSolved(gameData?.gameStartDate, gameData?.lastWinDate),
    [gameData.gameStartDate, gameData.lastWinDate]
  );
  const wordLength = useMemo(() => WORD_LENGTH[gameMode], [gameMode]);
  const numTries = useMemo(() => NUM_TRIES[gameMode], [gameMode]);

  const solve = useCallback(
    (ans: string) => {
      if (ans.length !== wordLength) {
        throw new IncompleteWordError(wordLength);
      }
      const answer = ans.toLowerCase();
      const { word: solution } = roundData as RoundData;
      const selectedDict = dict[WORD_LENGTH[gameMode]];

      const isValidWord = !!selectedDict.find(
        (dictWord) => dictWord === answer
      );

      if (!isValidWord) {
        throw new InvalidWordError();
      }

      const splitAnswer = answer.split('');

      let result: [string, LetterStatus][] = splitAnswer.map((letter) => [
        letter,
        LetterStatus.wrong,
      ]);

      let checklist: [string, boolean][] = solution
        .toUpperCase()
        .split('')
        .map((letter) => [letter.toLowerCase(), false]);

      result = result.map(([rLetter, rStatus], i) => {
        if (rLetter === checklist[i][0] && !checklist[i][1]) {
          checklist = Object.assign([], checklist, {
            [i]: [checklist[i], true],
          });
          return [rLetter, LetterStatus.correct];
        }

        return [rLetter, rStatus];
      });

      result = result.map(([rLetter, rStatus]) => {
        if (rStatus !== LetterStatus.correct) {
          const matchIdx = checklist.findIndex(
            ([cLetter, cUsed]) => !cUsed && cLetter === rLetter
          );

          if (matchIdx >= 0) {
            checklist = Object.assign([], checklist, {
              [matchIdx]: [checklist[matchIdx], true],
            });
            return [rLetter, LetterStatus.wrongSpot];
          }
        }

        return [rLetter, rStatus];
      }) as UserGameHistory['word'];

      const isFirstAnswer = state[gameMode].history.length === 0;

      let newState: UserData = {
        ...state,
        [gameMode]: {
          ...state[gameMode],
          history: [
            ...state[gameMode].history,
            {
              word: result.map(([r, l]) => [r.toUpperCase(), l]),
              guessedAt: new Date().toISOString(),
            },
          ],
          gameStartDate: isFirstAnswer
            ? new Date().toISOString()
            : state[gameMode].gameStartDate,
        },
      };

      const isSolved = !result.find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, status]) => status !== LetterStatus.correct
      );
      const isDone = state[gameMode].history.length === numTries - 1;

      if (isSolved || isDone) {
        const {
          winStreak,
          numPlayed,
          numWins,
          lastWinDate,
          longestWinStreak,
          turnStats,
          history,
        } = state[gameMode] as UserGameData;
        // TODO: Check if no game was skipped
        const newWinStreak = isSolved ? winStreak + 1 : 0;

        newState = {
          ...newState,
          [gameMode]: {
            ...newState[gameMode],
            numPlayed: numPlayed + 1,
            numWins: numWins + (isSolved ? 1 : 0),
            lastWinDate: isSolved ? new Date().toISOString() : lastWinDate,
            gameStatus: isSolved ? GameStatus.win : GameStatus.lose,
            winStreak: newWinStreak,
            longestWinStreak:
              newWinStreak > longestWinStreak ? newWinStreak : longestWinStreak,
            turnStats: isSolved
              ? Object.assign([], turnStats, {
                  [history.length - 1]: turnStats[history.length - 1] + 1,
                })
              : turnStats,
          },
        };
      }

      setState(newState);
      return newState[gameMode];
    },
    [dict, gameMode, numTries, roundData, state, wordLength]
  );
  const resetLocalStorage = useCallback(() => setState(DEFAULT_USER_DATA), []); // TODO
  const getShareStatus = useCallback(
    (options?: Partial<OnShareOptions>) => {
      const { showTimeSolved, showLink } = options || {};
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

      if (gameMode === GameMode.kal) {
        gameModeTitle = 'Saltong Kalimbahin';
      }

      const scoreText = `${
        gameData.gameStatus === GameStatus.win ? history.length : 'X'
      }/${numTries}`;

      const timeSolvedText =
        showTimeSolved && timeSolved ? `⌛${timeSolved}` : '';

      const winStateText = `\n🏅${scoreText}  ${timeSolvedText}`;

      return `${gameModeTitle} ${gameMode === GameMode.kal ? '' : gameId}${
        gameData.gameStatus === GameStatus.win
          ? winStateText
          : ` (${scoreText})`
      }

${grid}

${gameMode === GameMode.kal ? '#LeniKiko2022 #AngatBuhayLahat' : ''}
${
  showLink && gameMode !== GameMode.kal
    ? `${DOMAIN}${gameMode !== GameMode.main ? `/${gameMode}` : ''}`
    : ''
}`;
    },
    [colorMode, gameData, gameMode, numTries, timeSolved]
  );

  useEffect(() => {
    if (isLoading || isError || !(roundData as RoundData)?.word) {
      return;
    }

    let persistState = getGamePersistState();
    const currDate = new Date().toISOString();

    const getNewUserGameData = (gameMode: GameMode): UserGameData => ({
      ...DEFAULT_USER_GAME_DATA,
      gameStartDate: currDate,
      turnStats: getNumArr(NUM_TRIES[gameMode]).map(() => 0),
    });

    if (!persistState?.version || !isSupportedVersion(persistState.version)) {
      console.warn(
        'No user data found or outdated data version. Initializing data...'
      );
      setFirstVisit(true);

      persistState = {
        ...persistState,
        main: getNewUserGameData(GameMode.main),
        mini: getNewUserGameData(GameMode.mini),
        max: getNewUserGameData(GameMode.max),
        kal: getNewUserGameData(GameMode.kal),
        version: VERSION,
        uuid: uuidv4(),
      };
    } else {
      if (!persistState?.kal?.gameId) {
        persistState = {
          ...persistState,
          kal: getNewUserGameData(GameMode.kal),
        };

        setPersistState(LOCAL_KAL_STATUS, false);
      }

      const isValidGame =
        gameMode === GameMode.kal ||
        isSameDay(
          new Date(currDate),
          new Date(persistState[gameMode].gameStartDate)
        );

      // eslint-disable-next-line no-console
      console.log('isSameDay', {
        isValidGame,
        currDate,
        gameDate: persistState[gameMode].gameStartDate,
      });

      persistState = {
        ...persistState,
        [gameMode]: isValidGame
          ? persistState[gameMode]
          : {
              ...persistState[gameMode],
              history: DEFAULT_USER_GAME_DATA.history,
              gameStatus: DEFAULT_USER_GAME_DATA.gameStatus,
              gameStartDate: currDate,
            },
      };
    }

    const currRound = roundData as RoundData;
    persistState = {
      ...persistState,
      [gameMode]: {
        ...persistState[gameMode],
        gameId: currRound.gameId,
        correctAnswer: currRound.word,
      },
    };

    if (!persistState?.uuid) {
      persistState = {
        ...persistState,
        uuid: uuidv4(),
      };
    }

    // check if curr word is incorrect even if same game id
    if (
      (persistState[gameMode] as UserGameData).gameId === roundData.gameId &&
      (persistState[gameMode] as UserGameData).correctAnswer !==
        (roundData as RoundData).word
    ) {
      persistState = {
        ...persistState,
        [gameMode]: {
          ...persistState[gameMode],
          correctAnswer: (roundData as RoundData).word,
        },
      };
    }
    setState(persistState);
  }, [gameMode, isError, isLoading, roundData]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('setState', { isLoading, isError });

    if (isLoading || isError) {
      return;
    }
    setGamePersistState(state);
  }, [isError, isLoading, state]);

  const value: useGameProps = {
    ...gameData,
    firstVisit,
    setFirstVisit,
    solve,
    resetLocalStorage,
    getShareStatus,
    letterStatuses,
    gameMode,
    timeSolved,
    wordLength,
    numTries,
    isLoading,
    isError,
    fetchError,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
