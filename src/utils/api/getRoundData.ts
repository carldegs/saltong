import { format } from 'date-fns';

import mainRound from '../../mainRound.json';
import maxRound from '../../maxRound.json';
import miniRound from '../../miniRound.json';
import GameMode from '../../types/GameMode';
import { RoundData } from '../../types/RoundData';

const ROUNDS_DATA = {
  [GameMode.main]: mainRound,
  [GameMode.mini]: miniRound,
  [GameMode.max]: maxRound,
};

const getRoundData = (date: string, gameMode: GameMode): RoundData => {
  const dateStr = format(new Date(date), 'yyyy-MM-dd');
  const rounds: Record<string, RoundData> = ROUNDS_DATA[gameMode];
  return rounds[dateStr];
};

export default getRoundData;
