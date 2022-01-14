import { format } from 'date-fns';

import { delay } from '..';
import tempRounds from '../../tempRound.json';
import GameMode from '../../types/GameMode';
import { PrivateRoundData, RoundData } from '../../types/RoundData';

const getRoundData = async (
  date: string,
  // TODO: Temporary only
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gameMode: GameMode
): Promise<RoundData> => {
  const dateStr = format(new Date(date), 'yyyy-MM-dd');
  const rounds: Record<string, PrivateRoundData> = tempRounds;

  await delay(200);

  const { word, ...round } = rounds[dateStr];
  return round;
};

export default getRoundData;
