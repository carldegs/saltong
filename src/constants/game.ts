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
