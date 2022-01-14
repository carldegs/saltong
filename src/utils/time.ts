import { startOfTomorrow, intervalToDuration, addHours } from 'date-fns';

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

const PH_TIMEZONE = -8;
export const correctTimezone = (dateStr: string) => {
  const date = new Date(dateStr);
  const timezone = date.getTimezoneOffset() / 60;
  const diffTimezone = timezone - PH_TIMEZONE;
  const newDate = addHours(date, diffTimezone);

  return newDate;
};
