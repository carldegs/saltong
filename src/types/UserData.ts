import GameStatus from './GameStatus';
import LetterStatus from './LetterStatus';

export interface UserGameHistory {
  guessedAt: string;
  word: [string, LetterStatus][];
}

export interface UserGameData {
  numPlayed: number;
  numWins: number;
  lastWinDate: string;
  history: UserGameHistory[];
  turnStats: Record<number, number>;
  gameStatus: GameStatus;
  gameStartDate: string;
  gameId: number | string;
}

interface UserData {
  main: UserGameData;
  mini: UserGameData;
  max: UserGameData;
}

export default UserData;
