import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';

export const getBlacklist = async () => {
  try {
    const { data } = await axios.get<string[]>('/api/data/hexBlacklist.json');
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
