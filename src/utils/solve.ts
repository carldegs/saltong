import axios from 'axios';

import ApiError from '../lib/errors/ApiError';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { PrivateRoundData } from '../types/RoundData';
import { UserGameHistory } from '../types/UserData';

export const solveWord = async (
  answer: string[],
  gameMode: GameMode,
  uuid?: string
) => {
  try {
    const { data } = await axios.post<UserGameHistory['word']>('api/solve', {
      answer,
      gameMode,
      uuid,
    });

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message } = data || {};
    throw new ApiError(status, message);
  }
};

export const getRound = async (gameMode: GameMode) => {
  try {
    const { data } = await axios.get<UserGameHistory['word']>(
      `api/round/${gameMode}`
    );

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message } = data || {};
    throw new ApiError(status, message);
  }
};

export const getRoundWithAnswer = async (
  gameMode: GameMode,
  gameStatus: GameStatus,
  uuid?: string
) => {
  try {
    const { data } = await axios.post<PrivateRoundData>(
      `api/round/${gameMode}`,
      {
        gameStatus,
        uuid,
      }
    );

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message } = data || {};
    throw new ApiError(status, message);
  }
};
