import { createClient } from 'contentful';
import { useQuery } from 'react-query';

import ApiError from '../lib/errors/ApiError';
import GameMode from '../types/GameMode';

const client = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
  ? createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    })
  : { getEntries: () => undefined };

export const getContentfulData = async (gameMode: GameMode) => {
  try {
    const data = await client.getEntries({
      content_type: 'gameMode',
      'fields.slug[in]': gameMode,
      include: 2,
    });

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryContentful = (gameMode: GameMode) => {
  return useQuery(['contentful', gameMode], () => getContentfulData(gameMode), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useQueryContentful;
