import { isSameDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { getDateString } from '.';
import { VERSION } from '../constants';
import HexRounds from '../hexRound.json';
import { HexGameData, HexGameState } from '../types/HexGameData';

const HEX_STATE = 'saltong-hex-data';

export const DEFAULT_HEX_STATE: HexGameState = {
  prevRootWordId: -1,
  prevCenterLetter: '',
  rootWordId: -1,
  centerLetter: '',
  gameId: 0,
  scores: {},
  score: 0,
  maxScore: 0,
  gameStartDate: '',
  guessedWords: [],
  version: VERSION,
  uuid: '',
};

export const DEFAULT_HEX_GAME_DATA: HexGameData = {
  rootWordId: -1,
  centerLetter: '',
  date: '',
  gameId: 0,
};

export const dispatch = <T = HexGameState>(callback: () => T) => {
  if (typeof window !== 'undefined') {
    return callback();
  }
};

// Actions
export const getHexState = () =>
  JSON.parse(localStorage.getItem(HEX_STATE) || '{}') as HexGameState;

export const setHexState = (gameState: HexGameState) =>
  localStorage.setItem(HEX_STATE, JSON.stringify(gameState));

export const setScore = (
  score: number,
  maxScore?: number,
  date = new Date(),
  state?: HexGameState
) => {
  state = state?.version ? state : getHexState();
  const dateStr = getDateString(date);
  const roundScoreData = {
    score,
    maxScore: maxScore || state.scores[dateStr].maxScore,
  };

  state = {
    ...state,
    scores: {
      ...state.scores,
      [dateStr]: roundScoreData,
    },
    ...(isSameDay(date, new Date()) ? roundScoreData : {}),
  };

  setHexState(state);
  return state;
};

export const setRound = (date: Date, state: HexGameState) => {
  const currRound: HexGameData = HexRounds[getDateString(date)];
  const prevRound: HexGameData =
    HexRounds[getDateString(date)] || DEFAULT_HEX_GAME_DATA;

  state = {
    ...state,
    prevRootWordId: prevRound.rootWordId || DEFAULT_HEX_STATE.prevRootWordId,
    prevCenterLetter: prevRound.centerLetter || '',
    rootWordId: currRound.rootWordId || DEFAULT_HEX_STATE.rootWordId,
    centerLetter: currRound.centerLetter || '',
    gameId: currRound.gameId || DEFAULT_HEX_STATE.gameId,
  };

  setHexState(state);
  return state;
};

export const initializeGameData = (state = getHexState()) => {
  const date = new Date();
  state = setRound(date, state);
  state = setScore(0);

  setHexState(state);
  return state;
};

export const initialize = () => {
  let state = getHexState();
  const date = new Date();

  if (!state?.version) {
    state = {
      ...DEFAULT_HEX_STATE,
      gameStartDate: date.toISOString(),
      uuid: uuidv4(),
    };
  }

  if (!isSameDay(date, new Date(state.gameStartDate))) {
    state = initializeGameData(state);
  }

  setHexState(state);
  return state;
};
