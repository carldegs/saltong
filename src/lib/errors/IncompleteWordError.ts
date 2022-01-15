import ApiError from './ApiError';

class IncompleteWordError extends ApiError {
  constructor(wordLength: number) {
    super(500, `Answer must be ${wordLength} characters long.`);
  }
}

export default IncompleteWordError;
