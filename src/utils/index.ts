export * from './time';
export * from './versioning';
export * from './gtag';
export * from './hex';
export * from './local';

export const getNumArr = (numElements: number) => [
  ...Array(numElements).keys(),
];
