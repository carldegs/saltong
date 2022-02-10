import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';
import { BalGameData } from '../types/BalGameData';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import { RoundData } from '../types/RoundData';
import { getCurrGameDate, getDateString } from '../utils';

type Data = RoundData | HexGameData | BalGameData;

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

const useQueryRoundData = <T = Data>(
  gameMode: GameMode,
  date?: string,
  isPrevHex?: boolean,
  options?: UseQueryOptions<T, ApiError>
) => {
  return useQuery<T, ApiError>(
    date ? ['round', gameMode, date] : ['round', gameMode],
    () => getRoundData(gameMode, date, isPrevHex),
    {
      ...options,
    }
  );
};

export default useQueryRoundData;
