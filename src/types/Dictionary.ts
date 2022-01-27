export type Dictionary = Record<number, string[]>;

export interface DictionaryState {
  dictionary: Dictionary;
  version: string;
}

export interface BlacklistState {
  blacklist: string[];
  version: string;
}
