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
  HexGameWordListItem,
} from '../types/HexGameData';
import { getDateString } from '../utils';
import {
  checkWordValidity,
  getCurrGameDate,
  getFlatDict,
  getRank,
  getWordScore,
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
  rootWord: string;
  numPangrams: number;
  numWords: number;
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
}

const DEFAULT_DATA: useHexGameProps = {
  ...DEFAULT_HEX_STATE,
  firstVisit: false,
  setFirstVisit: null,
  rootWord: '',
  numPangrams: -1,
  numWords: -1,
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
  const { data: hround, ...roundQueryData } = useQueryRoundData(GameMode.hex);
  const hexRound = hround as HexGameData;
  const { data: blacklist, ...blacklistQueryData } = useQueryBlacklist();
  const { data: dict, ...dictQueryData } = useQueryDictionary();

  const isLoading = useMemo(
    () =>
      roundQueryData.isLoading ||
      blacklistQueryData.isLoading ||
      dictQueryData.isLoading,
    [
      roundQueryData.isLoading,
      blacklistQueryData.isLoading,
      dictQueryData.isLoading,
    ]
  );
  const isError = useMemo(
    () =>
      roundQueryData.isError ||
      blacklistQueryData.isError ||
      dictQueryData.isError,
    [roundQueryData.isError, blacklistQueryData.isError, dictQueryData.isError]
  );

  const fetchError = useMemo(
    () =>
      roundQueryData.error || blacklistQueryData.error || dictQueryData.error,
    [roundQueryData.error, blacklistQueryData.error, dictQueryData.error]
  );
  const toast = useToast();
  const keyboardRef = useKeyboard();
  const [state, setState] = useState(DEFAULT_HEX_STATE);
  const [firstVisit, setFirstVisit] = useState(false);

  const flatDict = useMemo(
    () =>
      !state?.rootWord && !(dict && dict[4]?.length) ? [] : getFlatDict(dict),
    [dict, state?.rootWord]
  );

  const rank = useMemo(
    () => getRank(state.score, hexRound?.maxScore),
    [state.score, hexRound?.maxScore]
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

      const defaultToast: UseToastOptions = {
        position: 'top',
        duration: 800,
      };

      answer = answer.toLowerCase();

      if (answer.length < 4 || answer.length > 19) {
        toast({
          description:
            answer.length < 4
              ? 'Word must be at least 4 letters long'
              : 'Word must not exceed 19 letters',
          status: 'error',
          ...defaultToast,
        });
      } else {
        const isValidWord = checkWordValidity(
          answer,
          flatDict,
          state.rootWord,
          blacklist,
          state.centerLetter
        );

        const match: HexGameWordListItem = isValidWord
          ? {
              word: answer,
              isPangram: isPangram(answer),
              score: getWordScore(answer),
            }
          : undefined;

        const hasAnswered =
          state.guessedWords.findIndex(({ word }) => word === answer) >= 0;

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
                maxScore: hexRound.maxScore,
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
      }

      if (keyboardRef.current?.value) {
        keyboardRef.current.value = '';
        keyboardRef.current.blur();
        keyboardRef.current.focus();
      }
    },
    [
      blacklist,
      flatDict,
      hexRound?.maxScore,
      keyboardRef,
      state.centerLetter,
      state.guessedWords,
      state.rootWord,
      toast,
    ]
  );

  const resetLocalStorage = useCallback(() => {
    setState(DEFAULT_HEX_STATE);
  }, []);

  useEffect(() => {
    if (isLoading || isError || !(hexRound as HexGameData)?.rootWord) {
      return;
    }

    let persistState = getHexPersistState();
    const currGameDate = getCurrGameDate();
    const { gameId, rootWord, centerLetter } = hexRound as HexGameData;

    // Check if first visit, else update state
    if (!persistState?.version) {
      setFirstVisit(true);

      // add current game and prev game
      persistState = {
        ...persistState,
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
        centerLetter,
      };
    }

    // Check if some data is incorrect even though same game id
    if (persistState.rootWord !== (hexRound as HexGameData).rootWord) {
      persistState = {
        ...persistState,
        rootWord: (hexRound as HexGameData).rootWord,
        centerLetter: (hexRound as HexGameData).centerLetter,
      };
    }

    ['rootWord', 'centerLetter'].forEach((param: string) => {
      if (
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
  }, [hexRound, isLoading, isError]);

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
    maxScore: hexRound?.maxScore,
    numPangrams: hexRound?.numPangrams,
    numWords: hexRound?.numWords,
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
