import createApiHandler from '../../../lib/api/create-api-handler';
import GameMode from '../../../types/GameMode';
import getRoundData from '../../../utils/api/getRoundData';

const RoundHandler = createApiHandler().get(async (req, res) => {
  const resp = await getRoundData(
    new Date().toISOString(),
    req.query.gameMode as GameMode
  );

  res.json(resp);
});

export default RoundHandler;
