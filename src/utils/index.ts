export * from './userData';
export * from './solve';
export * from './time';

export const getNumArr = (numElements: number) => [
  ...Array(numElements).keys(),
];
