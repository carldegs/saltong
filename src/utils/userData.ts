import { getNumArr } from '.';
import { DEFAULT_USER_GAME_DATA, NUM_TRIES } from '../constants';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import UserData, { UserGameData, UserGameHistory } from '../types/UserData';

const USER_DATA = 'saltong-user-data';

// TODO: Test if working
export const isValidGame = (date: string) => {
  const now = new Date();
  const gameDate = new Date(date);

  return (
    gameDate.getFullYear() === now.getFullYear() &&
    gameDate.getMonth() === now.getMonth() &&
    gameDate.getDate() === now.getDate()
  );
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
    main: resetDailyGameDataIfOutdated(userData.main, date),
    mini: resetDailyGameDataIfOutdated(userData.mini, date),
    max: resetDailyGameDataIfOutdated(userData.max, date),
  };
};

export const hardResetUserData = () =>
  checkWindow(() => {
    const date = new Date().toISOString();

    const userData = {
      main: getDefaultUserGameData(date, GameMode.main),
      mini: getDefaultUserGameData(date, GameMode.mini),
      max: getDefaultUserGameData(date, GameMode.max),
    };
    setUserData(userData);
    return userData;
  });

export const initialize = () =>
  checkWindow(() => {
    let userData = getUserData();

    if (!userData?.main?.history) {
      console.warn('No user data found. Initializing data...');
      return hardResetUserData();
    }

    userData = resetDailyUserDataIfOutdated(userData);

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

export const setEndGame = (gameMode: GameMode, win: boolean) =>
  checkWindow(() => {
    const userData = getUserData();
    const newUserData = {
      ...userData,
      [gameMode]: {
        ...userData[gameMode],
        numPlayed: userData[gameMode].numPlayed + 1,
        numWins: userData[gameMode].numWins + (win ? 1 : 0),
        lastWinDate: win
          ? new Date().toISOString()
          : userData[gameMode].lastWinDate,
        gameStatus: win ? GameStatus.win : GameStatus.lose,
      },
    };

    // TODO: Compute for turn wins summary

    setUserData(newUserData);
    return newUserData;
  });
