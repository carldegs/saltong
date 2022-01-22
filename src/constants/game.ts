import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { UserGameData } from '../types/UserData';

export const NUM_TRIES = {
  [GameMode.main]: 6,
  [GameMode.mini]: 5,
  [GameMode.max]: 8,
};

export const WORD_LENGTH = {
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

export const HEX_RANK = [
  { name: 'baguhan', percentage: 0 },
  { name: 'mabuti', percentage: 0.01 },
  { name: 'marunong', percentage: 0.03 },
  { name: 'magaling', percentage: 0.05 },
  { name: 'mahusay', percentage: 0.1 },
  { name: 'bihasa', percentage: 0.2 },
  { name: 'bigatin', percentage: 0.3 },
  { name: 'dakila', percentage: 0.45 },
  { name: 'bathala', percentage: 0.6 },
];
