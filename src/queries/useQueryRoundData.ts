import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import { RoundData } from '../types/RoundData';
import { getCurrGameDate, getDateString } from '../utils';

type Data = RoundData | HexGameData;

export const getRoundData = async <T = Data>(
  gameMode: GameMode,
  date?: string,
  isPrevHex?: boolean
) => {
  try {
    const { data } = await axios.get<T>(
      `/api/round/${gameMode}/${
        date ||
        getDateString(
          gameMode === GameMode.hex ? getCurrGameDate() : new Date()
        )
      }${isPrevHex ? '?prevHex=true' : ''}`
    );

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryRoundData = (
  gameMode: GameMode,
  date?: string,
  isPrevHex?: boolean,
  options?: UseQueryOptions<Data, ApiError>
) => {
  return useQuery(
    date ? ['round', gameMode, date] : ['round', gameMode],
    () => getRoundData(gameMode, date, isPrevHex),
    {
      ...options,
    }
  );
};

export default useQueryRoundData;
