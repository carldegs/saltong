export interface RoundData {
  gameId: number | string;
  date: string;
}

export interface PrivateRoundData extends RoundData {
  word: string;
}
