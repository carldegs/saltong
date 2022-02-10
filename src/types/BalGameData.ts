import { UserGameHistory } from './UserData';

// Saved in json file
export interface BalGameData {
  rootWord: string;
  pattern: string;
  date: string;
  gameId: number;
}

// Data type for localstorage
export interface BalGameState {
  rootWord: string;
  pattern: string;
  prevRootWord: string;
  prevPattern: string;
  scores: Record<
    string,
    { time: number; isCompleted: boolean; gameStarted: number }
  >;
  gameDate: string;
  version: string;
  uuid: string;
  history: UserGameHistory[];
}
