import ApiError from './ApiError';

class RoundNotFoundError extends ApiError {
  constructor(gameMode: string) {
    super(404, `Round for Saltong ${gameMode} not found`);
  }
}

export default RoundNotFoundError;
