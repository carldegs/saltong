import axios from 'axios';
import { gunzip } from 'fflate';
import { useQuery, UseQueryOptions } from 'react-query';
import util from 'util';

import { LOCAL_DICT_DATA, VERSION } from '../constants';
import ApiError from '../lib/errors/ApiError';
import { DictionaryState } from '../types/Dictionary';
import { isDictionaryUpToDate } from '../utils';
import { getPersistState, setPersistState } from '../utils/local';

const getDictionaryPersistState = () =>
  getPersistState<DictionaryState>(LOCAL_DICT_DATA);

const setDictionaryPersistState = (dictionaryState: DictionaryState) =>
  setPersistState(LOCAL_DICT_DATA, dictionaryState);

export const getDictionary = async () => {
  try {
    const persistState = getDictionaryPersistState();

    if (
      persistState?.version &&
      isDictionaryUpToDate(persistState.version) &&
      persistState.dictionary[4]?.length
    ) {
      return persistState.dictionary;
    }

    const { data } = await axios.get('/api/data/dict.json.gz', {
      responseType: 'arraybuffer',
    });
    const decodedData = new Uint8Array(Buffer.from(data, 'base64'));

    const unzip = util.promisify(gunzip);
    const unzippedData = await unzip(decodedData);
    const unzippedStr = new TextDecoder().decode(unzippedData);
    const parsed = JSON.parse(unzippedStr) as Record<number, string[]>;

    setDictionaryPersistState({
      ...persistState,
      dictionary: parsed,
      version: VERSION,
    });

    return parsed;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryDictionary = (
  options?: UseQueryOptions<Record<number, string[]>, ApiError>
) => {
  return useQuery(['dictionary'], () => getDictionary(), options);
};

export default useQueryDictionary;
