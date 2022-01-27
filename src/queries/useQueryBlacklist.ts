import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import { LOCAL_BLACKLIST_DATA, VERSION } from '../constants';
import ApiError from '../lib/errors/ApiError';
import { BlacklistState } from '../types/Dictionary';
import { isDictionaryUpToDate } from '../utils';
import { getPersistState, setPersistState } from '../utils/local';

const getBlacklistPersistState = () =>
  getPersistState<BlacklistState>(LOCAL_BLACKLIST_DATA);

const setBlacklistPersistState = (blacklistState: BlacklistState) =>
  setPersistState(LOCAL_BLACKLIST_DATA, blacklistState);

export const getBlacklist = async () => {
  try {
    const persistState = getBlacklistPersistState();
    if (
      persistState?.version &&
      isDictionaryUpToDate(persistState.version) &&
      persistState.blacklist?.length
    ) {
      return persistState.blacklist;
    }

    const { data } = await axios.get<string[]>('/api/data/hexBlacklist.json');

    setBlacklistPersistState({
      ...persistState,
      blacklist: data,
      version: VERSION,
    });

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryBlacklist = (options?: UseQueryOptions<string[], ApiError>) => {
  return useQuery(['blacklist'], () => getBlacklist(), options);
};

export default useQueryBlacklist;
