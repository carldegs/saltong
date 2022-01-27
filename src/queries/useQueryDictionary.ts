import axios from 'axios';
import { gunzip } from 'fflate';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../lib/errors/ApiError';

export const getDictionary = async () => {
  try {
    const { data } = await axios.get('/api/data/dict.json.gz', {
      responseType: 'arraybuffer',
    });
    const decodedData = new Uint8Array(Buffer.from(data, 'base64'));
    // const unzippedData = ungzip(decodedData, { to: 'string' });
    let unzippedData = '{}';
    await gunzip(decodedData, (err, data) => {
      if (err?.message) {
        throw new ApiError(err.code, err.message);
      }

      unzippedData = new TextDecoder().decode(data);
    });
    return JSON.parse(unzippedData) as Record<number, string[]>;
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
