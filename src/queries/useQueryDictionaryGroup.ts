import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';

export const getDictionaryGroup = async (wordLength: number) => {
  try {
    const { data } = await axios.get<string[]>(`/dictionary/${wordLength}`);
    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryDictionaryGroup = (
  wordLength,
  options?: UseQueryOptions<string[], ApiError>
) => {
  return useQuery(
    ['dictionary', wordLength],
    () => getDictionaryGroup(wordLength),
    options
  );
};

export default useQueryDictionaryGroup;
