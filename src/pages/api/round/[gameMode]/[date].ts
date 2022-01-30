import fs from 'fs';
import path from 'path';

import createApiHandler from '../../../../lib/api/create-api-handler';
import ApiError from '../../../../lib/errors/ApiError';
import FileNotFoundError from '../../../../lib/errors/FileNotFoundError';
import GameMode from '../../../../types/GameMode';

const RoundHandler = createApiHandler().get(async (req, res) => {
  try {
    const { gameMode, date } = req.query as {
      gameMode: GameMode;
      date: string;
    };
    const fileName = `json/${gameMode}Round.json`;
    const dir = path.resolve('./public', fileName);
    const file = await fs.promises.readFile(dir);
    const data = JSON.parse(file.toString());

    if (!data) {
      throw new FileNotFoundError(fileName);
    }

    const currRound = data[date];

    if (
      (gameMode === GameMode.hex && !currRound?.rootWord) ||
      (gameMode !== GameMode.hex && !currRound?.word)
    ) {
      // TODO: Change error
      throw new FileNotFoundError(fileName);
    }

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
    res.json(currRound);
  } catch (err) {
    throw new ApiError(500, err?.message);
  }
});

export default RoundHandler;
