import { WORD_LENGTH } from '../constants';
import dictionary from '../dict.json';
import InvalidWordError from '../lib/errors/InvalidWordError';
import GameMode from '../types/GameMode';
import LetterStatus from '../types/LetterStatus';
import { UserGameHistory } from '../types/UserData';
import getRoundData from './api/getRoundData';

export const solveWord = (
  answer: string[],
  gameMode: GameMode
): UserGameHistory['word'] => {
  const currDate = new Date().toString();
  const { word: solution } = getRoundData(currDate, gameMode);

  const dict = dictionary[WORD_LENGTH[gameMode]];

  const isValidWord = !!dict.find(
    (dictWord) => dictWord === (answer as string[]).join('').toLowerCase()
  );

  if (!isValidWord) {
    throw new InvalidWordError();
  }

  let result: [string, LetterStatus][] = answer.map((letter) => [
    letter,
    LetterStatus.wrong,
  ]);

  let checklist: [string, boolean][] = solution
    .toUpperCase()
    .split('')
    .map((letter) => [letter, false]);

  // Check correct letters
  result = result.map(([rLetter, rStatus], i) => {
    if (rLetter === checklist[i][0] && !checklist[i][1]) {
      checklist = Object.assign([], checklist, { [i]: [checklist[i], true] });
      return [rLetter, LetterStatus.correct];
    }

    return [rLetter, rStatus];
  });

  // Check wrong spot letters
  result = result.map(([rLetter, rStatus]) => {
    if (rStatus !== LetterStatus.correct) {
      const matchIdx = checklist.findIndex(
        ([cLetter, cUsed]) => !cUsed && cLetter === rLetter
      );

      if (matchIdx >= 0) {
        checklist = Object.assign([], checklist, {
          [matchIdx]: [checklist[matchIdx], true],
        });
        return [rLetter, LetterStatus.wrongSpot];
      }
    }

    return [rLetter, rStatus];
  });

  return result as UserGameHistory['word'];
};
