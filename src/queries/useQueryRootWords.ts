import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';

export const getRootWords = async () => {
  try {
    const { data } = await axios.get<string[]>('/api/data/root_words.json');
    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryRootWords = (options?: UseQueryOptions<string[], ApiError>) => {
  return useQuery(['rootWords'], () => getRootWords(), options);
};

export default useQueryRootWords;
