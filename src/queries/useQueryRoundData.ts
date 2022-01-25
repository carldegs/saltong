import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import { RoundData } from '../types/RoundData';

type Data = Record<string, RoundData | HexGameData>;

export const getRoundData = async (gameMode: GameMode) => {
  try {
    const { data } = await axios.get<Data>(`/api/data/${gameMode}Round.json`);

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryRoundData = (
  gameMode: GameMode,
  options?: UseQueryOptions<Data, ApiError>
) => {
  return useQuery(['round', gameMode], () => getRoundData(gameMode), {
    ...options,
  });
};

export default useQueryRoundData;
