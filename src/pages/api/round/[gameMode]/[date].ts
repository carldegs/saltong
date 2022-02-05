import fs from 'fs';
import path from 'path';

import createApiHandler from '../../../../lib/api/create-api-handler';
import ApiError from '../../../../lib/errors/ApiError';
import FileNotFoundError from '../../../../lib/errors/FileNotFoundError';
import GameMode from '../../../../types/GameMode';
import { HexGameData } from '../../../../types/HexGameData';

const RoundHandler = createApiHandler().get(async (req, res) => {
  try {
    const { gameMode, date, prevHex } = req.query as {
      gameMode: GameMode;
      date: string;
      prevHex?: string;
    };

    const fileName = `json/${gameMode}Round.json`;
    const dir = path.resolve('./public', fileName);
    const file = await fs.promises.readFile(dir);
    const data = JSON.parse(file.toString());

    if (!data) {
      throw new FileNotFoundError(fileName);
    }

    let currRound = data[date];

    if (
      (gameMode === GameMode.hex && !currRound?.rootWord) ||
      (gameMode !== GameMode.hex && !currRound?.word)
    ) {
      // TODO: Change error
      throw new FileNotFoundError(fileName);
    }

    if (gameMode === GameMode.hex && !prevHex) {
      const { words, ...currRoundData } = currRound as HexGameData;
      currRound = currRoundData;
    }

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
    res.json(currRound);
  } catch (err) {
    throw new ApiError(500, err?.message);
  }
});

export default RoundHandler;
