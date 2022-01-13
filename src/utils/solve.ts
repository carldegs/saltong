import axios from 'axios';

import GameMode from '../types/GameMode';
import { UserGameHistory } from '../types/UserData';

export const solveWord = async (answer: string[], gameMode: GameMode) =>
  await axios.post<UserGameHistory['word']>('api/solve', { answer, gameMode });
