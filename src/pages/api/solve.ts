import { NextApiRequest } from 'next';

import createApiHandler from '../../lib/api/create-api-handler';
import GameMode from '../../types/GameMode';
import LetterStatus from '../../types/LetterStatus';

interface SolveHandlerRequest extends NextApiRequest {
  body: {
    answer: string[];
    gameMode: GameMode;
  };
}

const SolveHandler = createApiHandler().post<SolveHandlerRequest>(
  async (req, res) => {
    const { answer } = req.body;
    // TODO: Check if answer is part of valid word list.
    // TODO: Get word somewhere
    const correct = ['L', 'A', 'M', 'O', 'K'];

    let result = answer.map((letter) => [letter, LetterStatus.wrong]);

    correct.forEach((cLetter, j) => {
      const matchIdx = result.findIndex(
        ([letter, status]) =>
          letter === cLetter && status === LetterStatus.wrong
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
