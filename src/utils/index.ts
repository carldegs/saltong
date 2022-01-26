export * from './time';
export * from './versioning';
export * from './gtag';
export * from './hex';

export const getNumArr = (numElements: number) => [
  ...Array(numElements).keys(),
];
