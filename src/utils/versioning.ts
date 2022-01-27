import semver from 'semver';

import {
  MIN_SUPPORTED_DICTIONARY_VERSION,
  MIN_SUPPORTED_VERSION,
} from '../constants';

export const parseVersion = (version: string): number[] =>
  version
    .replace('v', '')
    .split('.')
    .map((v) => Number(v));

export const isSameVersion = (
  gameVersion: string,
  currVersion: string,
  checkUntil: 'major' | 'minor' | 'patch' = 'patch'
): boolean => {
  const gver = parseVersion(gameVersion);
  const cver = parseVersion(currVersion);

  const isDiffMajor = gver[0] !== cver[0];

  if (isDiffMajor || checkUntil === 'major') {
    return !isDiffMajor;
  }

  const isDiffMinor = gver[1] !== cver[1];

  if (isDiffMinor || checkUntil === 'minor') {
    return !isDiffMinor;
  }

  return gver[2] === cver[2];
};

export const isSupportedVersion = (gameVersion: string): boolean => {
  return semver.satisfies(gameVersion, `>=${MIN_SUPPORTED_VERSION}`);
};

export const isDictionaryUpToDate = (gameVersion: string): boolean => {
  return semver.satisfies(gameVersion, `>=${MIN_SUPPORTED_DICTIONARY_VERSION}`);
};
