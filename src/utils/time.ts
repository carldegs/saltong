import { startOfTomorrow, intervalToDuration } from 'date-fns';

export const getCountdownToNextDay = () =>
  intervalToDuration({
    start: new Date(),
    end: startOfTomorrow(),
  });

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const delay = async (delay = 1000, callback = () => {}) => {
  const delayPromise = (ms) => new Promise((res) => setTimeout(res, ms));
  await delayPromise(delay);

  callback();
};
