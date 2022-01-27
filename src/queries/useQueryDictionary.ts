import axios from 'axios';
import { gunzip } from 'fflate';
import { useQuery, UseQueryOptions } from 'react-query';
import util from 'util';

import ApiError from '../lib/errors/ApiError';

export const getDictionary = async () => {
  try {
    const { data } = await axios.get('/api/data/dict.json.gz', {
      responseType: 'arraybuffer',
    });
    const decodedData = new Uint8Array(Buffer.from(data, 'base64'));

    const unzip = util.promisify(gunzip);
    const unzippedData = await unzip(decodedData);
    const unzippedStr = new TextDecoder().decode(unzippedData);
    const parsed = JSON.parse(unzippedStr) as Record<number, string[]>;

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
