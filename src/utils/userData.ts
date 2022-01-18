import { isSameDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { getNumArr } from '.';
import { DEFAULT_USER_GAME_DATA, NUM_TRIES, VERSION } from '../constants';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import UserData, { UserGameData, UserGameHistory } from '../types/UserData';
import getRoundData from './api/getRoundData';
import { isSupportedVersion } from './versioning';

const USER_DATA = 'saltong-user-data';

// TODO: Refactor data manipulation
export const isValidGame = (date: string) => {
  const now = new Date();
  const gameDate = new Date(date);

  return isSameDay(now, gameDate);
};

function checkWindow<T = void>(callback: () => T) {
  if (typeof window !== 'undefined') {
    return callback();
  }
}

export const getUserData = () =>
  checkWindow(
    () => JSON.parse(localStorage.getItem(USER_DATA) || '{}') as UserData
  );

export const setUserData = (userData: UserData) =>
  checkWindow(() => localStorage.setItem(USER_DATA, JSON.stringify(userData)));

export const getDefaultUserGameData = (
  gameStartDate = new Date().toISOString(),
  gameMode: GameMode
): UserGameData => ({
  ...DEFAULT_USER_GAME_DATA,
  gameStartDate,
  turnStats: getNumArr(NUM_TRIES[gameMode]).map(() => 0),
});

const resetDailyGameData = (
  gameData: UserGameData,
  newGameStartDate = new Date().toISOString()
): UserGameData => ({
  ...gameData,
  history: DEFAULT_USER_GAME_DATA.history,
  gameStatus: DEFAULT_USER_GAME_DATA.gameStatus,
  gameStartDate: newGameStartDate,
});

const resetDailyGameDataIfOutdated = (
  gameData: UserGameData,
  newStartDate: string
): UserGameData =>
  isValidGame(gameData.gameStartDate)
    ? gameData
    : resetDailyGameData(gameData, newStartDate);

const resetDailyUserDataIfOutdated = (userData: UserData): UserData => {
  const date = new Date().toISOString();
  return {
    ...userData,
    main: resetDailyGameDataIfOutdated(userData.main, date),
    mini: resetDailyGameDataIfOutdated(userData.mini, date),
    max: resetDailyGameDataIfOutdated(userData.max, date),
    version: userData.version,
  };
};

export const hardResetUserData = () =>
  checkWindow(() => {
    const date = new Date().toISOString();

    const userData: UserData = {
      main: getDefaultUserGameData(date, GameMode.main),
      mini: getDefaultUserGameData(date, GameMode.mini),
      max: getDefaultUserGameData(date, GameMode.max),
      version: VERSION,
      uuid: uuidv4(),
    };
    setUserData(userData);
    return userData;
  });

export const updateGameStartDate = (gameMode: GameMode) =>
  checkWindow(() => {
    let newUserData: UserData = getUserData();

    newUserData = {
      ...newUserData,
      [gameMode]: {
        ...newUserData[gameMode],
        gameStartDate: new Date().toISOString(),
      },
    };

    setUserData(newUserData);

    return newUserData;
  });

export const hardResetUserDataIfOutdatedVersion = (userData: UserData) => {
  if (!userData?.version || !isSupportedVersion(userData.version)) {
    return hardResetUserData();
  }
  return userData;
};

export const setGameDataId = (
  gameData: UserGameData,
  date: string,
  gameMode: GameMode
): UserGameData => {
  const { gameId, word } = getRoundData(date, gameMode);
  return {
    ...gameData,
    gameId,
    correctAnswer: word,
  };
};

export const setAllGameDataId = (userData: UserData) => {
  const date = new Date().toISOString();

  return {
    ...userData,
    main: setGameDataId(userData.main, date, GameMode.main),
    mini: setGameDataId(userData.mini, date, GameMode.mini),
    max: setGameDataId(userData.max, date, GameMode.max),
  };
};

export const initialize = () =>
  checkWindow(() => {
    let userData = getUserData();

    if (!userData?.version) {
      console.warn('No user data found. Initializing data...');
      userData = hardResetUserData();
    } else {
      userData = resetDailyUserDataIfOutdated(userData);
      userData = hardResetUserDataIfOutdatedVersion(userData);
    }

    userData = setAllGameDataId(userData);

    if (!userData?.uuid) {
      userData = {
        ...userData,
        uuid: uuidv4(),
      };
    }

    setUserData(userData);
    return userData;
  });

export const addAnswer = (
  answer: UserGameHistory['word'],
  gameMode: GameMode
) =>
  checkWindow(() => {
    const userData = getUserData();
    const newUserData = {
      ...userData,
      [gameMode]: {
        ...userData[gameMode],
        history: [
          ...userData[gameMode].history,
          {
            word: answer,
            guessedAt: new Date().toISOString(),
          },
        ],
      },
    };

    setUserData(newUserData);

    return newUserData;
  });

export const addCorrectAnswer = (correctAnswer: string, gameMode: GameMode) =>
  checkWindow(() => {
    const userData = getUserData();
    const newUserData: UserData = {
      ...userData,
      [gameMode]: {
        ...userData[gameMode],
        correctAnswer,
      },
    };

    setUserData(newUserData);

    return newUserData;
  });

export const setEndGame = (gameMode: GameMode, win: boolean) =>
  checkWindow(() => {
    const userData = getUserData();
    const {
      winStreak,
      numPlayed,
      numWins,
      lastWinDate,
      longestWinStreak,
      turnStats,
      history,
    } = userData[gameMode];
    // TODO: Check if no game was skipped
    const newWinStreak = win ? winStreak + 1 : 0;
    const newUserData = {
      ...userData,
      [gameMode]: {
        ...userData[gameMode],
        numPlayed: numPlayed + 1,
        numWins: numWins + (win ? 1 : 0),
        lastWinDate: win ? new Date().toISOString() : lastWinDate,
        gameStatus: win ? GameStatus.win : GameStatus.lose,
        winStreak: newWinStreak,
        longestWinStreak:
          newWinStreak > longestWinStreak ? newWinStreak : longestWinStreak,
        turnStats: win
          ? Object.assign([], turnStats, {
              [history.length - 1]: turnStats[history.length - 1] + 1,
            })
          : turnStats,
      },
    };

    setUserData(newUserData);
    return newUserData;
  });

export const resetUserData = () =>
  checkWindow(() => {
    let userData = hardResetUserData();
    userData = setAllGameDataId(userData);

    setUserData(userData);

    return userData;
  });
