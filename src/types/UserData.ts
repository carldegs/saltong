import GameStatus from './GameStatus';
import LetterStatus from './LetterStatus';

export interface UserGameHistory {
  guessedAt: string;
  word: [string, LetterStatus][];
}

export interface UserGameData {
  numPlayed: number;
  numWins: number;
  winStreak: number;
  longestWinStreak: number;
  lastWinDate: string;
  history: UserGameHistory[];
  turnStats: number[];
  gameStatus: GameStatus;
  gameStartDate: string;
  gameId: number | string;
  correctAnswer?: string;
}

interface UserData {
  main: UserGameData;
  mini: UserGameData;
  max: UserGameData;
  version: string;
  uuid?: string;
}

export default UserData;
