/* eslint-disable no-console */
import { NextApiRequest } from 'next';

import createApiHandler from '../../../lib/api/create-api-handler';
import PrivateRoundError from '../../../lib/errors/PrivateRoundError';
import GameMode from '../../../types/GameMode';
import GameStatus from '../../../types/GameStatus';
import { correctTimezone } from '../../../utils';
import getPrivateRoundData from '../../../utils/api/getPrivateRoundData';
import getRoundData from '../../../utils/api/getRoundData';

interface PrivateRoundRequest extends NextApiRequest {
  query: {
    gameMode: GameMode;
  };
  body: {
    gameStatus: GameStatus;
    uuid?: string;
  };
}

const RoundHandler = createApiHandler()
  .get(async (req, res) => {
    // eslint-disable-next-line no-console
    console.log(correctTimezone(new Date().toISOString()).toISOString());
    const resp = await getRoundData(
      correctTimezone(new Date().toISOString()).toISOString(),
      req.query.gameMode as GameMode
    );

    res.json(resp);
  })
  .post<PrivateRoundRequest>(async (req, res) => {
    const { gameStatus, uuid } = req.body;
    const { gameMode } = req.query;
    console.log(`${uuid} Requesting answer for ${gameMode} (${gameStatus})`);

    if (gameStatus === GameStatus.playing) {
      throw new PrivateRoundError();
    }

    const resp = await getPrivateRoundData(
      correctTimezone(new Date().toISOString()).toISOString(),
      gameMode
    );

    res.json(resp);
  });

export default RoundHandler;
