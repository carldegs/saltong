/* eslint-disable no-console */
import { NextApiRequest } from 'next';

import { WORD_LENGTH } from '../../constants';
import dictionary from '../../dict.json';
import createApiHandler from '../../lib/api/create-api-handler';
import InvalidWordError from '../../lib/errors/InvalidWordError';
import GameMode from '../../types/GameMode';
import LetterStatus from '../../types/LetterStatus';
import { correctTimezone } from '../../utils';
import getPrivateRoundData from '../../utils/api/getPrivateRoundData';

interface SolveHandlerRequest extends NextApiRequest {
  body: {
    answer: string[];
    gameMode: GameMode;
    uuid?: string;
  };
}

const SolveHandler = createApiHandler().post<SolveHandlerRequest>(
  async (req, res) => {
    const { answer, gameMode, uuid } = req.body;
    const currDate = new Date().toISOString();
    const correctedDate = correctTimezone(currDate).toISOString();

    const roundData = getPrivateRoundData(correctedDate, gameMode);
    const correct = roundData.word.toUpperCase().split('');
    const dict = dictionary[WORD_LENGTH[gameMode]];

    const isValidWord = !!dict.find(
      (dictWord) => dictWord === (answer as string[]).join('').toLowerCase()
    );

    console.log({
      time: {
        current: new Date(currDate).toString(),
        corrected: new Date(correctedDate).toString(),
      },
      answer,
      correct,
      isValidWord,
      uuid,
    });

    if (!isValidWord) {
      throw new InvalidWordError();
    }

    let result = answer.map((letter) => [letter, LetterStatus.wrong]);

    correct.forEach((cLetter, j) => {
      const matchIdx = result.findIndex(
        ([letter, status]) =>
          letter === cLetter && status !== LetterStatus.correct
      );
      if (matchIdx >= 0) {
        result = Object.assign([], result, {
          [matchIdx]: [
            result[matchIdx][0],
            matchIdx === j ? LetterStatus.correct : LetterStatus.wrongSpot,
          ],
        });
      }
    });

    res.json(result);
  }
);

export default SolveHandler;
