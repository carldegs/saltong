import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_BAL_STATE } from '../constants';
import ApiError from '../lib/errors/ApiError';
import ContextNoProviderError from '../lib/errors/ContextNoProviderError';
import IncompleteWordError from '../lib/errors/IncompleteWordError';
import InvalidWordError from '../lib/errors/InvalidWordError';
import useQueryDictionary from '../queries/useQueryDictionary';
import useQueryRoundData from '../queries/useQueryRoundData';
import { BalGameData, BalGameState } from '../types/BalGameData';
import GameMode from '../types/GameMode';
import LetterStatus from '../types/LetterStatus';
import { UserGameHistory } from '../types/UserData';

// const getBalPersistState = () => getPersistState<BalGameState>(LOCAL_BAL_DATA);
// const setBalPersistState = (gameState: BalGameState) =>
//   setPersistState(LOCAL_BAL_DATA, gameState);

interface useBalGameProps extends BalGameState {
  patternGrid: LetterStatus[][];
  isLoading: boolean;
  isError: boolean;
  fetchError?: ApiError;
  letterStatuses?: Record<string, LetterStatus>;
  solve: (answer: string) => void;
  resetLocalStorage: () => void;
}

const DEFAULT_DATA: useBalGameProps = {
  ...DEFAULT_BAL_STATE,
  patternGrid: [],
  isLoading: false,
  isError: false,
  fetchError: undefined,
  solve: () => undefined,
  resetLocalStorage: () => undefined,
};

const BalGameContext = createContext<useBalGameProps>(DEFAULT_DATA);

export const useBalGame = () => {
  const hexGame = useContext(BalGameContext);

  if (!hexGame) {
    throw new ContextNoProviderError('useBalGame', 'BalGameProvider');
  }

  return hexGame;
};

export const BalGameProvider: React.FC = ({ children }) => {
  // const router = useRouter();
  const { data: roundData, ...roundQueryData } = useQueryRoundData<BalGameData>(
    GameMode.bal
  );
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
  // const { colorMode } = useColorMode();

  const [state, setState] = useState(DEFAULT_BAL_STATE);
  // const [firstVisit, setFirstVisit] = useState(false);
  const patternGrid = useMemo(() => {
    return roundData?.pattern
      ? roundData.pattern
          .split('/')
          .map((row) =>
            row.split('').map((cell) => Number(cell) as any as LetterStatus)
          )
      : [];
  }, [roundData?.pattern]);

  const letterStatuses = useMemo(() => {
    const history = state?.history;

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
  }, [state.history]);

  const solve = useCallback(
    (ans: string) => {
      const solution = roundData?.rootWord || '';
      if (ans.length !== solution.length) {
        throw new IncompleteWordError(solution.length);
      }
      const answer = ans.toLowerCase();
      const selectedDict = dict[solution.length];

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

      const turnNum = state.history.length;

      const isMatch = result.every(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, rStatus], i) => rStatus === patternGrid[turnNum][i]
      );

      if (!isMatch) {
        console.error('wrong match');
        return;
      }

      const newState: BalGameState = {
        ...state,
        history: [
          ...state.history,
          {
            word: result.map(([r, l]) => [r.toUpperCase(), l]),
            guessedAt: new Date().toISOString(),
          },
        ],
        gameDate: turnNum === 0 ? new Date().toISOString() : state.gameDate,
      };

      setState(newState);
      return newState;
    },
    [dict, patternGrid, roundData?.rootWord, state]
  );

  const resetLocalStorage = useCallback(() => setState(DEFAULT_BAL_STATE), []);

  const value = {
    ...state,
    isLoading,
    isError,
    fetchError,
    letterStatuses,
    patternGrid,
    solve,
    resetLocalStorage,
  };

  return (
    <BalGameContext.Provider value={value}>{children}</BalGameContext.Provider>
  );
};
