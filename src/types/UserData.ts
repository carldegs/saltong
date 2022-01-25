import GameMode from './GameMode';
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

interface UserData
  extends Record<Exclude<GameMode, GameMode.hex>, UserGameData> {
  version: string;
  uuid?: string;
}

export default UserData;
