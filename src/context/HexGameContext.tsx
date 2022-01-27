import { useToast, UseToastOptions } from '@chakra-ui/toast';
import { isSameDay } from 'date-fns';
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
  DEFAULT_HEX_GAME_DATA,
  DEFAULT_HEX_STATE,
  HEX_RANK,
  LOCAL_HEX_DATA,
  VERSION,
} from '../constants';
import ApiError from '../lib/errors/ApiError';
import ContextNoProviderError from '../lib/errors/ContextNoProviderError';
import useQueryBlacklist from '../queries/useQueryBlacklist';
import useQueryDictionary from '../queries/useQueryDictionary';
import useQueryRoundData from '../queries/useQueryRoundData';
import GameMode from '../types/GameMode';
import {
  HexGameData,
  HexGameState,
  HexGameWordList,
  HexGameWordListItem,
} from '../types/HexGameData';
import { getDateString } from '../utils';
import {
  getCurrGameDate,
  getHexWordList,
  getPrevGameDate,
  getRank,
  isPangram,
} from '../utils/hex';
import { getPersistState, setPersistState } from '../utils/local';
import { useKeyboard } from './KeyboardContext';

const getHexPersistState = () => getPersistState<HexGameState>(LOCAL_HEX_DATA);
const setHexPersistState = (gameState: HexGameState) =>
  setPersistState(LOCAL_HEX_DATA, gameState);

interface useHexGameProps extends HexGameState {
  firstVisit: boolean;
  setFirstVisit: Dispatch<SetStateAction<boolean>>;
  list: HexGameWordListItem[];
  rootWord: string;
  maxScore: number;
  solve: (answer: string) => void;
  letters: string[];
  rank: {
    index: number;
    name: string;
    percentage: number;
    icon: string;
  };
  resetLocalStorage: () => void;
  isLoading: boolean;
  isError: boolean;
  fetchError?: ApiError;
  getPrevData: () => {
    prevRootWord: string;
    prevAnswers: { list: HexGameWordListItem[]; maxScore: number };
    prevCenterLetter: string;
  };
}

const DEFAULT_DATA: useHexGameProps = {
  ...DEFAULT_HEX_STATE,
  firstVisit: false,
  setFirstVisit: null,
  list: [],
  rootWord: '',
  maxScore: -1,
  solve: () => undefined,
  letters: [],
  rank: {
    ...HEX_RANK[0],
    index: 0,
  },
  resetLocalStorage: () => undefined,
  isLoading: false,
  isError: false,
  fetchError: undefined,
  getPrevData: () => ({
    prevRootWord: '',
    prevCenterLetter: '',
    prevAnswers: { list: [], maxScore: 0 },
  }),
};

const HexGameContext = createContext<useHexGameProps>(DEFAULT_DATA);

export const useHexGame = () => {
  const hexGame = useContext(HexGameContext);

  if (!hexGame) {
    throw new ContextNoProviderError('useHexGame', 'HexGameProvider');
  }

  return hexGame;
};

export const HexGameProvider: React.FC = ({ children }) => {
  const { data: hexRound, ...roundQueryData } = useQueryRoundData(GameMode.hex);
  const { data: prevHexRound, ...prevRoundQueryData } = useQueryRoundData(
    GameMode.hex,
    getDateString(getPrevGameDate())
  );
  const { data: blacklist, ...blacklistQueryData } = useQueryBlacklist();
  const { data: dict, ...dictQueryData } = useQueryDictionary();

  const isLoading = useMemo(
    () =>
      roundQueryData.isLoading ||
      blacklistQueryData.isLoading ||
      dictQueryData.isLoading ||
      prevRoundQueryData.isLoading,
    [
      roundQueryData.isLoading,
      blacklistQueryData.isLoading,
      dictQueryData.isLoading,
      prevRoundQueryData.isLoading,
    ]
  );
  const isError = useMemo(
    () =>
      roundQueryData.isError ||
      blacklistQueryData.isError ||
      dictQueryData.isError ||
      prevRoundQueryData.isError,
    [
      roundQueryData.isError,
      blacklistQueryData.isError,
      dictQueryData.isError,
      prevRoundQueryData.isError,
    ]
  );

  const fetchError = useMemo(
    () =>
      roundQueryData.error ||
      blacklistQueryData.error ||
      dictQueryData.error ||
      prevRoundQueryData.error,
    [
      roundQueryData.error,
      blacklistQueryData.error,
      dictQueryData.error,
      prevRoundQueryData.error,
    ]
  );
  const toast = useToast();
  const keyboardRef = useKeyboard();
  const [state, setState] = useState(DEFAULT_HEX_STATE);
  const [firstVisit, setFirstVisit] = useState(false);
  const getPrevData = useCallback(() => {
    if (
      state.prevRootWord &&
      state.prevCenterLetter &&
      blacklist?.length &&
      dict &&
      dict[4]?.length
    ) {
      return {
        prevCenterLetter: state.prevCenterLetter,
        prevRootWord: state.prevRootWord,
        prevAnswers: getHexWordList(
          state.prevRootWord,
          state.prevCenterLetter,
          blacklist,
          dict
        ),
      };
    }

    return {
      prevCenterLetter: '',
      prevRootWord: '',
      prevAnswers: { list: [], maxScore: 0 },
    };
  }, [state.prevRootWord, state.prevCenterLetter, blacklist, dict]);
  const { list, maxScore } = useMemo(
    () =>
      !state?.rootWord
        ? ({
            list: [],
          } as HexGameWordList)
        : getHexWordList(state.rootWord, state.centerLetter, blacklist, dict),
    [blacklist, dict, state.centerLetter, state.rootWord]
  );
  const rank = useMemo(
    () => getRank(state.score, maxScore),
    [state.score, maxScore]
  );
  const letters = useMemo(
    () =>
      Array.from(new Set(Array.from(state.rootWord))).filter(
        (l) => l !== state.centerLetter
      ),
    [state.centerLetter, state.rootWord]
  );

  const solve = useCallback(
    (answer: string) => {
      if (!answer) {
        return;
      }

      answer = answer.toLowerCase();

      const match = list.find(({ word }) => word === answer);
      const hasAnswered =
        state.guessedWords.findIndex(({ word }) => word === answer) >= 0;

      const defaultToast: UseToastOptions = {
        position: 'top',
        duration: 800,
      };

      if (!match?.word) {
        toast({
          description: answer.includes(state.centerLetter)
            ? 'Not in word list'
            : 'Center letter required',
          status: 'error',
          ...defaultToast,
        });
      } else if (hasAnswered) {
        toast({
          description: 'Already answered',
          status: 'warning',
          ...defaultToast,
        });
      } else if (match?.word && !hasAnswered) {
        const currDateStr = getDateString(getCurrGameDate());
        setState((curr) => ({
          ...curr,
          guessedWords: [
            ...curr.guessedWords,
            { word: answer, isPangram: isPangram(answer) },
          ],
          score: curr.score + match.score,
          scores: {
            ...curr.scores,
            [currDateStr]: {
              score: (curr.scores[currDateStr]?.score || 0) + match.score,
              maxScore,
            },
          },
        }));
        toast({
          description: `+${match.score} pts ${
            match.isPangram ? '(PANGRAM!)' : ''
          }`,
          status: match.isPangram ? 'success' : 'info',
          ...defaultToast,
        });
      }

      if (keyboardRef.current?.value) {
        keyboardRef.current.value = '';
        keyboardRef.current.blur();
        keyboardRef.current.focus();
      }
    },
    [keyboardRef, list, maxScore, state.centerLetter, state.guessedWords, toast]
  );

  const resetLocalStorage = useCallback(() => {
    setState(DEFAULT_HEX_STATE);
  }, []);

  useEffect(() => {
    if (
      isLoading ||
      isError ||
      !(hexRound as HexGameData)?.rootWord ||
      !(prevHexRound as HexGameData)?.rootWord
    ) {
      return;
    }

    let persistState = getHexPersistState();
    const currGameDate = getCurrGameDate();
    const { gameId, rootWord, centerLetter } = hexRound as HexGameData;
    const { rootWord: prevRootWord, centerLetter: prevCenterLetter } =
      (prevHexRound as HexGameData) || DEFAULT_HEX_GAME_DATA;

    // Check if first visit, else update state
    if (!persistState?.version) {
      setFirstVisit(true);

      // add current game and prev game
      persistState = {
        ...persistState,
        prevRootWord,
        prevCenterLetter,
        rootWord,
        centerLetter,
        gameId,
        scores: {
          [getDateString(new Date())]: {
            score: 0,
            maxScore: 0,
          },
        },
        score: 0,
        gameStartDate: new Date().toISOString(),
        guessedWords: [],
        version: VERSION,
        uuid: uuidv4(),
      };
    }

    // Check if game is outdated
    if (!isSameDay(getCurrGameDate(persistState.gameStartDate), currGameDate)) {
      persistState = {
        ...persistState,
        prevRootWord,
        prevCenterLetter,
        rootWord,
        centerLetter,
        gameId,
        scores: {
          ...persistState.scores,
          [getDateString(new Date())]: {
            score: 0,
            maxScore: 0,
          },
        },
        score: 0,
        gameStartDate: new Date().toISOString(),
        guessedWords: [],
        version: VERSION,
      };
    }

    // Check if data still only includes rootWordId
    if (!persistState?.rootWord && (persistState as any)?.rootWordId) {
      persistState = {
        ...persistState,
        rootWord,
        prevRootWord,
      };
    }

    // Check if some data is incorrect even though same game id
    if (persistState.rootWord !== (hexRound as HexGameData).rootWord) {
      persistState = {
        ...persistState,
        rootWord: (hexRound as HexGameData).rootWord,
      };
    }

    [
      ['rootWord', false],
      ['prevRootWord', true],
      ['centerLetter', false],
      ['prevCenterLetter', true],
    ].forEach(([param, isPrev]: [string, boolean]) => {
      if (isPrev) {
        const prevParam = param
          .replace('prev', '')
          .replace('R', 'r')
          .replace('C', 'c');

        if (
          persistState.gameId - 1 === prevHexRound.gameId &&
          persistState[param] !== prevHexRound[prevParam]
        ) {
          persistState = {
            ...persistState,
            [param]: prevHexRound[prevParam],
          };
        }
      } else if (
        !isPrev &&
        persistState.gameId === hexRound.gameId &&
        persistState[param] !== hexRound[param]
      ) {
        persistState = {
          ...persistState,
          [param]: hexRound[param],
        };
      }
    });

    setState(persistState);
  }, [hexRound, isLoading, isError, prevHexRound]);

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    setHexPersistState(state);
  }, [isError, isLoading, state]);

  const value = {
    ...state,
    firstVisit,
    setFirstVisit,
    list,
    maxScore,
    getPrevData,
    solve,
    rank,
    letters,
    resetLocalStorage,
    isLoading,
    isError,
    fetchError,
  };

  return (
    <HexGameContext.Provider value={value}>{children}</HexGameContext.Provider>
  );
};
