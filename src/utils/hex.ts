import {
  addDays,
  closestTo,
  isFriday,
  isTuesday,
  previousFriday,
  previousTuesday,
} from 'date-fns';

import { HEX_RANK } from '../constants';
import { HexGameWordList, HexGameWordListItem } from '../types/HexGameData';

export const getFlatDict = (groupedDict: Record<number, string[]> = {}) => {
  let flattenedDict: string[] = [];
  Object.values(groupedDict).forEach((wordGroup) => {
    flattenedDict = [...flattenedDict, ...(wordGroup || [])];
  });
  return flattenedDict;
};

export const getMaxScore = (finalWordList: HexGameWordListItem[]) => {
  let maxScore = 0;

  finalWordList.forEach(({ score }) => {
    maxScore += score;
  });

  return maxScore;
};

export const checkWordValidity = (
  word: string,
  flatDict: string[],
  rootWord: string,
  blacklist: string[],
  centerLetter: string
): boolean => {
  const letters = word.split('');
  return (
    letters.includes(centerLetter) &&
    letters.every((letter) => rootWord.indexOf(letter) >= 0) &&
    !blacklist.includes(word) &&
    flatDict.includes(word)
  );
};

export const getHexWordList = (
  rootWord: string,
  centerLetter: string,
  blacklist: string[] = [],
  groupedDict: Record<number, string[]> = {}
): HexGameWordList => {
  const list = getFlatDict(groupedDict)
    .filter((word) => {
      const letters = word.split('');

      return (
        letters.includes(centerLetter) &&
        letters.every((letter) => rootWord.indexOf(letter) >= 0)
      );
    })
    .filter((word) => !blacklist.includes(word))
    .map((word) => ({
      word,
      score: getWordScore(word),
      isPangram: isPangram(word),
    }));

  const maxScore = getMaxScore(list);

  return {
    list,
    centerLetter,
    maxScore,
  };
};

export const isPangram = (word: string) =>
  Array.from(new Set(word)).length === 7;

export const getWordScore = (word: string) =>
  (word.length === 4 ? 1 : word.length) + (isPangram(word) ? 7 : 0);

export const getRank = (score: number, maxScore: number) => {
  const percentageScore = score / maxScore;
  const upperLimitIndex = HEX_RANK.findIndex(
    ({ percentage }) => percentageScore < percentage
  );

  if (upperLimitIndex === -1) {
    const rankLen = HEX_RANK.length;
    return {
      ...HEX_RANK[rankLen - 1],
      index: rankLen - 1,
    };
  }

  return {
    ...HEX_RANK[upperLimitIndex - 1],
    index: upperLimitIndex - 1,
  };
};

export const getCurrGameDate = (date: string | Date = new Date()) => {
  date = new Date(date);

  if (isTuesday(date) || isFriday(date)) {
    return date;
  }

  return closestTo(date, [previousTuesday(date), previousFriday(date)]);
};

export const getPrevGameDate = (currGameDate?: string | Date) => {
  currGameDate = new Date(currGameDate || getCurrGameDate(new Date()));
  const date = addDays(currGameDate, -1);

  return closestTo(date, [previousTuesday(date), previousFriday(date)]);
};
