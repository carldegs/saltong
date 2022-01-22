import {
  startOfTomorrow,
  intervalToDuration,
  addHours,
  isSameDay,
  format,
} from 'date-fns';

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

export const padDuration = (duration: Duration) =>
  Object.fromEntries(
    Object.entries(duration).map(([key, value]) => [
      key,
      ('00' + value).slice(-2),
    ])
  ) as Record<keyof Duration, string>;

export const getTimeSolved = (
  start: string | Date,
  end: string | Date
): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!isSameDay(startDate, endDate)) {
    return undefined;
  }

  const duration = intervalToDuration({
    start: new Date(start),
    end: new Date(end),
  });

  return `${duration.hours ? `${duration.hours}h ` : ''}${
    duration.minutes ? `${duration.minutes}m ` : ''
  }${
    duration.seconds || (!duration.hours && !duration.minutes)
      ? `${duration.seconds}s`
      : ''
  }`;
};

export const getDateString = (date: Date | string = new Date()) =>
  format(new Date(date), 'yyyy-MM-dd');
