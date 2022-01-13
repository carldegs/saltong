import { NextApiRequest, NextApiResponse } from 'next';
import nc, { NextConnect } from 'next-connect';

import ApiError from '../errors/ApiError';

const createApiHandler = (): NextConnect<NextApiRequest, NextApiResponse> =>
  nc<NextApiRequest, NextApiResponse>({
    onError: (err: ApiError, _req, res) => {
      if (err instanceof ApiError) {
        const details = err.toJson();
        res.status(details.statusCode).json({
          message: details.message,
          payload: details.payload,
        });
      } else {
        console.log(err); //eslint-disable-line no-console
        res.status(500).json({
          message: 'Unexpected server error',
        });
      }
    },
  });

export default createApiHandler;
