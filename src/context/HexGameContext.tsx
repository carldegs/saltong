import { useToast, UseToastOptions } from '@chakra-ui/react';
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
  VERSION,
} from '../constants';
import hexRound from '../hexRound.json';
import ContextNoProviderError from '../lib/errors/ContextNoProviderError';
import {
  HexGameData,
  HexGameState,
  HexGameWordList,
  HexGameWordListItem,
} from '../types/HexGameData';
import { getDateString } from '../utils';
import {
  getCurrGameDate,
  getHexRootWord,
  getHexWordList,
  getPrevGameDate,
  getRank,
  isPangram,
} from '../utils/hex';
import { useKeyboard } from './KeyboardContext';

const LOCAL_HEX_DATA = 'saltong-hex-data';

const getPersistState = () =>
  JSON.parse(localStorage.getItem(LOCAL_HEX_DATA) || '{}') as HexGameState;

const setPersistState = (gameState: HexGameState) =>
  localStorage.setItem(LOCAL_HEX_DATA, JSON.stringify(gameState));

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
  const toast = useToast();
  const keyboardRef = useKeyboard();
  const [state, setState] = useState(DEFAULT_HEX_STATE);
  const [firstVisit, setFirstVisit] = useState(false);
  const rootWord = useMemo(
    () => getHexRootWord(state.rootWordId) || '',
    [state.rootWordId]
  );
  const { list, maxScore } = useMemo(
    () =>
      !rootWord
        ? ({
            list: [],
          } as HexGameWordList)
        : getHexWordList(rootWord, state.centerLetter),
    [rootWord, state.centerLetter]
  );
  const rank = useMemo(
    () => getRank(state.score, maxScore),
    [state.score, maxScore]
  );
  const letters = useMemo(
    () =>
      Array.from(new Set(Array.from(rootWord))).filter(
        (l) => l !== state.centerLetter
      ),
    [state.centerLetter, rootWord]
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
        const currDateStr = getDateString();
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

  useEffect(() => {
    let persistState = getPersistState();
    const currGameDate = getCurrGameDate();
    const { gameId, rootWordId, centerLetter }: HexGameData =
      hexRound[getDateString(currGameDate)];
    const {
      rootWordId: prevRootWordId,
      centerLetter: prevCenterLetter,
    }: HexGameData =
      hexRound[getDateString(getPrevGameDate())] || DEFAULT_HEX_GAME_DATA;

    // Check if first visit, else update state
    if (!persistState?.version) {
      setFirstVisit(true);

      // add current game and prev game
      persistState = {
        ...persistState,
        prevRootWordId,
        prevCenterLetter,
        rootWordId,
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
    if (
      !isSameDay(getCurrGameDate(persistState.gameStartDate), currGameDate) ||
      persistState.rootWordId !== rootWordId
    ) {
      persistState = {
        ...persistState,
        prevRootWordId: persistState.rootWordId,
        prevCenterLetter: persistState.centerLetter,
        rootWordId,
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
    setState(persistState);
  }, [setFirstVisit]);

  useEffect(() => {
    setPersistState(state);
  }, [state]);

  const value = {
    ...state,
    firstVisit,
    setFirstVisit,
    list,
    maxScore,
    rootWord,
    solve,
    rank,
    letters,
  };

  return (
    <HexGameContext.Provider value={value}>{children}</HexGameContext.Provider>
  );
};
