export const getPersistState = <T>(key: string) =>
  JSON.parse(localStorage.getItem(key) || '{}') as T;

export const setPersistState = <T>(key: string, state: T) =>
  localStorage.setItem(key, JSON.stringify(state));
