import { DictionaryState } from '../types/Dictionary';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { HexGameData, HexGameState } from '../types/HexGameData';
import UserData, { UserGameData } from '../types/UserData';

export const NUM_TRIES: Record<Exclude<GameMode, 'hex'>, number> = {
  [GameMode.main]: 6,
  [GameMode.mini]: 5,
  [GameMode.max]: 8,
};

export const WORD_LENGTH: Record<Exclude<GameMode, 'hex'>, number> = {
  [GameMode.main]: 5,
  [GameMode.mini]: 4,
  [GameMode.max]: 7,
};

export const DEFAULT_USER_GAME_DATA: UserGameData = {
  numPlayed: 0,
  numWins: 0,
  winStreak: 0,
  longestWinStreak: 0,
  lastWinDate: '',
  history: [],
  turnStats: [],
  gameStatus: GameStatus.playing,
  gameStartDate: '',
  gameId: 0,
};

export const DEFAULT_USER_DATA: UserData = {
  mini: DEFAULT_USER_GAME_DATA,
  max: DEFAULT_USER_GAME_DATA,
  main: DEFAULT_USER_GAME_DATA,
  version: '',
  uuid: '',
};

export const DEFAULT_HEX_GAME_DATA: HexGameData = {
  rootWord: '',
  centerLetter: '',
  date: '',
  gameId: 0,
};

export const DEFAULT_HEX_STATE: HexGameState = {
  prevRootWord: '',
  prevCenterLetter: '',
  rootWord: '',
  centerLetter: '',
  gameId: 0,
  scores: {},
  score: 0,
  gameStartDate: '',
  guessedWords: [],
  version: '',
  uuid: '',
};

export const DEFAULT_DICTIONARY_STATE: DictionaryState = {
  version: '',
  dictionary: {},
};

export const HEX_RANK = [
  { name: 'baguhan', percentage: 0, icon: '👶' },
  { name: 'mabuti', percentage: 0.01, icon: '🤷' },
  { name: 'marunong', percentage: 0.03, icon: '🤔' },
  { name: 'magaling', percentage: 0.05, icon: '🤓' },
  { name: 'mahusay', percentage: 0.1, icon: '👌' },
  { name: 'bihasa', percentage: 0.2, icon: '👏' },
  { name: 'bigatin', percentage: 0.3, icon: '💪' },
  { name: 'dakila', percentage: 0.45, icon: '🙌' },
  { name: 'bathala', percentage: 0.6, icon: '⚡' },
];
