import ApiError from './ApiError';

class InvalidWordError extends ApiError {
  constructor() {
    super(500, 'Not in word list');
  }
}

export default InvalidWordError;
