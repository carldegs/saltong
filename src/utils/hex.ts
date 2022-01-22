import {
  addDays,
  closestTo,
  isFriday,
  isTuesday,
  previousFriday,
  previousTuesday,
} from 'date-fns';

import { HEX_RANK } from '../constants';
import groupedDict from '../dict.json';
import blacklist from '../hexBlacklist.json';
import rootWords from '../root_words.json';
import { HexGameWordList, HexGameWordListItem } from '../types/HexGameData';

export const getHexRootWordIndex = (rootWord: string) =>
  rootWords.indexOf(rootWord);

export const getHexRootWord = (rootWordIndex: number) =>
  rootWords[rootWordIndex];

export const getFlatDict = () => {
  let flattenedDict: string[] = [];
  Object.values(groupedDict).forEach((wordGroup) =>
    wordGroup.forEach((word) => {
      flattenedDict = [...flattenedDict, word];
    })
  );
  return flattenedDict;
};

export const getSubsetWordList = (rootWord: string) =>
  getFlatDict().filter((word) =>
    Array.from(word).every((letter) => rootWord.indexOf(letter) >= 0)
  );

export const getLetterScores = (subsetWordList: string[]) => {
  let letterScores: Record<string, number> = {};

  subsetWordList.forEach((word) => {
    Array.from(new Set(word)).forEach((letter) => {
      letterScores = {
        ...letterScores,
        [letter]: (letterScores[letter] || 0) + 1,
      };
    });
  });

  return letterScores;
};

const isValidFinalWord = (word: string, centerLetter: string) =>
  !!Array.from(word).find((letter) => letter === centerLetter);

export const getFinalWordList = (
  subsetWordList: string[],
  centerLetter: string
) => subsetWordList.filter((word) => isValidFinalWord(word, centerLetter));

export const getHexGameWordList = (words: string[]): HexGameWordListItem[] =>
  words
    .filter((word) => !blacklist.includes(word))
    .map((word) => ({
      word,
      score: getWordScore(word),
      isPangram: isPangram(word),
    }));

export const getMaxScore = (finalWordList: HexGameWordListItem[]) => {
  let maxScore = 0;

  finalWordList.forEach(({ score }) => {
    maxScore += score;
  });

  return maxScore;
};

export const getHexWordList = (
  rootWordOrIndex: number | string,
  centerLetter?: string
): HexGameWordList => {
  const rootWord =
    typeof rootWordOrIndex === 'number'
      ? rootWords[rootWordOrIndex]
      : rootWordOrIndex;

  const initWordList = getSubsetWordList(rootWord);
  const letterScores = getLetterScores(initWordList);

  const finalCenterLetter =
    centerLetter ||
    Object.keys(letterScores).reduce((a, b) =>
      letterScores[a] < letterScores[b] ? a : b
    );

  const list = getHexGameWordList(getFinalWordList(initWordList, centerLetter));

  const maxScore = getMaxScore(list);

  return {
    list,
    centerLetter: finalCenterLetter,
    maxScore,
  };
};

export const analyzeWord = (rootWord: string) => {
  const iniWordList = getSubsetWordList(rootWord);
  const hexList = getHexGameWordList(iniWordList);

  return {
    rootWord,
    info: Array.from(rootWord).map((centerLetter) => {
      const finalWords = hexList.filter(({ word }) =>
        isValidFinalWord(word, centerLetter)
      );
      const maxScore = getMaxScore(finalWords);

      return {
        centerLetter,
        numWords: finalWords.length,
        maxScore,
        wordList: finalWords.map(({ word }) => word),
      };
    }),
  };
};

export const isPangram = (word: string) =>
  Array.from(new Set(word)).length === 7;

export const getWordScore = (word: string) =>
  (word.length === 4 ? 1 : word.length) + (isPangram(word) ? 7 : 0);

export const logspace = (min: number, max: number, numSamples: number) => {
  const t = (max / min) ** (1 / numSamples);
  const samples = Array.from(Array(numSamples).keys()).map((i) =>
    Math.round(min * t ** i)
  );

  return samples;
};

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
