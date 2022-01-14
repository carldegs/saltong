import { format } from 'date-fns';

import tempRounds from '../../tempRound.json';
import GameMode from '../../types/GameMode';
import { PrivateRoundData } from '../../types/RoundData';

const getPrivateRoundData = (
  date: string,
  // TODO: Temporary only
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gameMode: GameMode
): PrivateRoundData => {
  const dateStr = format(new Date(date), 'yyyy-MM-dd');
  // eslint-disable-next-line no-console
  console.log('dateStr', dateStr);
  const rounds: Record<string, PrivateRoundData> = tempRounds;

  const round = rounds[dateStr];
  return round;
};

export default getPrivateRoundData;
